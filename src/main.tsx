import { render } from 'preact';
import { App } from './ui/App.tsx';
import { Fronteira } from './ui/Fronteira.tsx';
import './ui/estilo.css';

render(
  <Fronteira>
    <App />
  </Fronteira>,
  document.getElementById('app')!,
);
