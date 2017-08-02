import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

import Header from '../Header';
import Stage from '../Stage';
import Search from '../Search';
import NotFound from '../NotFound';
import App from '../App';


it('Render the Header', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Header />, div);
});

it('Render the Stage', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Stage />, div);
});

it('Render the Search box', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Search />, div);
});

it('Render Not Found page', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>, div);
});

it('Render the entire App', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
