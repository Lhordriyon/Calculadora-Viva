/** O símbolo do jogo: uma trajetória com marcos. */
export function Marca({ classe = 'marca' }: { classe?: string }) {
  return (
    <svg class={classe} viewBox="0 0 512 512" aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="#0e1420" />
      <path
        d="M104 404 C 184 404 196 268 276 244 S 372 168 410 108"
        fill="none"
        stroke="#e8b84a"
        stroke-width="34"
        stroke-linecap="round"
      />
      <circle cx="104" cy="404" r="30" fill="#e8b84a" />
      <circle cx="276" cy="244" r="24" fill="#e8b84a" />
      <circle cx="410" cy="108" r="42" fill="#e8b84a" />
    </svg>
  );
}
