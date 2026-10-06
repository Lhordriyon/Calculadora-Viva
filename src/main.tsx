import { render } from 'preact';
import { useState } from 'preact/hooks';

function App() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}

render(<App />, document.getElementById('app')!);
