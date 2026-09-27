import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { structureTranscript } from '../lib/ideas.mjs';
test('finds action phrases', () => { assert.equal(structureTranscript('Need to send the proposal.').actions.length, 1); });
