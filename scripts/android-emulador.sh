#!/usr/bin/env bash
# O jogo num Android de verdade (emulado): instala o APK, abre, começa uma vida, fecha o app e abre de novo.
#
# Uso: bash scripts/android-emulador.sh CAMINHO_DO_APK
#
# Roda no CI (.github/workflows/android.yml, no disparo manual), numa máquina com o SDK do Android e KVM. Sem janela.
# Confere, nesta ordem, e sai com 1 no primeiro que falhar:
#   1. o APK instala e a atividade do jogo abre e fica na frente, sem exceção fatal no log;
#   2. o jogo desenhou: a tela não é uma cor só, e o ouro do botão principal está nela;
#   3. o botão "Nascer" existe na árvore de acessibilidade, e tocar nele começa uma vida ("Viver mais 1 ano" aparece);
#   4. depois de fechar o app à força e abrir de novo, a vida continua lá (o save ficou no aparelho).
# Imprime a versão do Android e da WebView em que rodou. O que ele não vê: um aparelho físico, o toque de um dedo, a
# vibração e a letra do sistema de quem joga.
set -euo pipefail

APK="${1:?diga o caminho do APK}"
API="${API:-34}"
PACOTE="io.github.lhordriyon.trajetoria"
IMAGEM="system-images;android-${API};default;x86_64"
SDK="${ANDROID_HOME:?ANDROID_HOME não está definido}"
BIN="$SDK/cmdline-tools/latest/bin"
ADB="$SDK/platform-tools/adb"
AQUI="$(cd "$(dirname "$0")" && pwd)"

echo "== o emulador (Android API $API, x86_64)"
yes | "$BIN/sdkmanager" --licenses > /dev/null 2>&1 || true
"$BIN/sdkmanager" --install "platform-tools" "emulator" "$IMAGEM" > /dev/null
echo no | "$BIN/avdmanager" create avd --force -n trajetoria -k "$IMAGEM" --device "pixel_6" > /dev/null
"$SDK/emulator/emulator" -avd trajetoria -no-window -no-audio -no-boot-anim -no-snapshot -gpu swiftshader_indirect -camera-back none -camera-front none > emulador.log 2>&1 &
"$ADB" wait-for-device
ligou=""
for _ in $(seq 1 180); do
  if [ "$("$ADB" shell getprop sys.boot_completed 2> /dev/null | tr -d '\r')" = "1" ]; then
    ligou=1
    break
  fi
  sleep 2
done
if [ -z "$ligou" ]; then
  echo "✗ o emulador não ligou em 6 minutos"
  tail -40 emulador.log
  exit 1
fi
"$ADB" shell input keyevent 82 > /dev/null 2>&1 || true
"$ADB" shell settings put global window_animation_scale 0 > /dev/null 2>&1 || true
"$ADB" shell settings put global transition_animation_scale 0 > /dev/null 2>&1 || true
echo "Android $("$ADB" shell getprop ro.build.version.release | tr -d '\r') (API $("$ADB" shell getprop ro.build.version.sdk | tr -d '\r'))"
"$ADB" shell dumpsys webviewupdate 2> /dev/null | grep -i -m1 "Current WebView package" || true

abrir() {
  "$ADB" shell am start -W -n "$PACOTE/.MainActivity" > /dev/null
  sleep "${1:-20}"
}

# A árvore de acessibilidade da tela (a WebView entra nela quando alguém pede): tenta algumas vezes.
arvore() {
  for _ in 1 2 3 4 5 6; do
    "$ADB" shell uiautomator dump /sdcard/tela.xml > /dev/null 2>&1 || true
    "$ADB" exec-out cat /sdcard/tela.xml > tela.xml 2> /dev/null || true
    if grep -q -E "$1" tela.xml 2> /dev/null; then
      return 0
    fi
    sleep 4
  done
  return 1
}

# O centro do elemento com o texto dado ("x y"), pelos limites que a árvore diz.
centro() {
  node -e '
    const xml = require("node:fs").readFileSync("tela.xml", "utf8");
    const alvo = process.argv[1];
    for (const no of xml.split("<node ")) {
      if (!no.includes(`text="${alvo}`) && !no.includes(`content-desc="${alvo}`)) continue;
      const m = /bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/.exec(no);
      if (m) { console.log(Math.round((+m[1] + +m[3]) / 2) + " " + Math.round((+m[2] + +m[4]) / 2)); process.exit(0); }
    }
    process.exit(1);
  ' "$1"
}

echo "== 1. instalar e abrir"
"$ADB" install -r "$APK" > /dev/null
"$ADB" logcat -c
abrir 25
if ! "$ADB" shell pidof "$PACOTE" > /dev/null; then
  echo "✗ o processo do jogo não está de pé"
  "$ADB" logcat -d -t 200 | tail -60
  exit 1
fi
if "$ADB" logcat -d | grep -A12 "FATAL EXCEPTION" | grep -q "$PACOTE"; then
  echo "✗ exceção fatal no jogo:"
  "$ADB" logcat -d | grep -A25 "FATAL EXCEPTION" | head -60
  exit 1
fi
foco="$("$ADB" shell dumpsys activity activities | grep -E -m1 "topResumedActivity|mResumedActivity" || true)"
echo "na frente: $foco"
case "$foco" in
  *"$PACOTE"*) echo "✓ o APK instalou, o jogo abriu e ficou na frente, sem exceção fatal" ;;
  *)
    echo "✗ o jogo não está na frente"
    exit 1
    ;;
esac

echo "== 2. o jogo desenhou"
"$ADB" exec-out screencap > tela.raw
node "$AQUI/android-tela.cjs" tela.raw

echo "== 3. começar uma vida"
if ! arvore '(text|content-desc)="Nascer"'; then
  echo "✗ o botão Nascer não apareceu na árvore de acessibilidade da tela"
  head -c 1500 tela.xml || true
  exit 1
fi
echo "✓ o botão Nascer está na tela"
# shellcheck disable=SC2046
"$ADB" shell input tap $(centro "Nascer")
sleep 6
if ! arvore 'Viver mais 1 ano'; then
  echo "✗ tocar em Nascer não começou uma vida (o botão do ano não apareceu)"
  head -c 1500 tela.xml || true
  exit 1
fi
echo "✓ tocar em Nascer começou uma vida: o botão do ano apareceu"
# Vive um ano, para o save ter o que guardar além do nascimento.
# shellcheck disable=SC2046
"$ADB" shell input tap $(centro "Viver mais 1 ano")
sleep 4

echo "== 4. fechar à força e abrir de novo"
"$ADB" shell input keyevent 3
sleep 3
"$ADB" shell am force-stop "$PACOTE"
sleep 2
abrir 20
# A vida em andamento tem o cabeçalho com as folhas (com evento esperando ou não); a tela de nascer não tem.
if ! arvore '(text|content-desc)="(Família|Viver mais 1 ano)'; then
  if grep -q -E '(text|content-desc)="Nascer"' tela.xml 2> /dev/null; then
    echo "✗ o jogo abriu na tela de nascer: a vida não ficou guardada"
  else
    echo "✗ o jogo não voltou para a vida em andamento"
  fi
  head -c 1500 tela.xml || true
  exit 1
fi
echo "✓ depois de fechar e abrir, a vida continua: o save ficou no aparelho"
if "$ADB" logcat -d | grep -A12 "FATAL EXCEPTION" | grep -q "$PACOTE"; then
  echo "✗ exceção fatal no jogo durante o teste:"
  "$ADB" logcat -d | grep -A25 "FATAL EXCEPTION" | head -60
  exit 1
fi
echo "== tudo certo no Android emulado"
