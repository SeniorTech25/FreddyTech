import test from 'node:test';
import assert from 'node:assert/strict';
import { matchIntent, emailHref } from './intent.js';

test('specific preservation and education requests win over broader categories', () => {
  assert.equal(matchIntent('I have VHS tapes and old family videos').id, 'preserve');
  assert.equal(matchIntent('Train my team on AI').id, 'training');
  assert.equal(matchIntent('Can you build a website for my business?').id, 'build');
});
test('recognizes practical requests without matching AI inside unrelated words', () => {
  assert.equal(matchIntent('My Wi-Fi is broken').id, 'help');
  assert.equal(matchIntent('Edit my podcast').id, 'create');
  assert.equal(matchIntent('I want a chair'), null);
  assert.equal(matchIntent(''), null);
});
test('email draft preserves special characters and line breaks', () => {
  const href = emailHref({ name: 'Fred', email: 'fred@example.com', message: 'A&B?\nBudget: $500', topic: 'Video & sound' });
  const query = new URLSearchParams(href.split('?')[1]);
  assert.equal(query.get('subject'), 'FreddyTech / Video & sound');
  assert.match(query.get('body'), /A&B\?\nBudget: \$500/);
  assert.match(query.get('body'), /Reply to: fred@example.com/);
});
