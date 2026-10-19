import { render } from 'preact';
import { App } from './ui/App.tsx';
import { medirLetra } from './ui/letra.ts';
import './ui/estilo.css';

medirLetra();
addEventListener('resize', medirLetra);
render(<App />, document.getElementById('app')!);
