#!/usr/bin/env bun
// =============================================================================
// Verifies the visitor-input normalisation that guards `start_conversation`.
//
// These functions are the only thing standing between a crafted socket payload
// and (a) a stored XSS-grade script URL rendered as a link in the console,
// (b) a forged externalAuthToken that claims any agent as the assignee, and
// (c) an oversized metadata blob re-sent on every conversations_list poll.
// A silent relaxation here reopens all three, so each rule is asserted.
//
// Run: bun run check:visitor-input   (exits 1 on any regression)
// =============================================================================

import {
  VISITOR_METADATA_MAX,
  VISITOR_NAME_MAX,
  clampVisitorMetadata,
  clampVisitorText,
  parseVisitorMetadata,
  sanitizeVisitorUrl,
} from '../src/chat/visitor-input';

const failures: string[] = [];

function ok(label: string, actual: unknown, expected: unknown): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) failures.push(`${label}: expected ${e}, got ${a}`);
}

// --- clampVisitorText -------------------------------------------------------
ok('clamp trims', clampVisitorText('  kj  ', 10), 'kj');
ok('clamp drops blank', clampVisitorText('   ', 10), undefined);
ok('clamp drops non-string', clampVisitorText(42, 10), undefined);
ok('clamp caps length', clampVisitorText('abcdef', 3), 'abc');
ok('clamp keeps surrogate pairs intact', clampVisitorText('😀😀😀', 2), '😀😀');
ok('clamp keeps a name at the limit', clampVisitorText('a'.repeat(VISITOR_NAME_MAX), VISITOR_NAME_MAX)?.length, VISITOR_NAME_MAX);

// --- sanitizeVisitorUrl — the XSS-relevant one ------------------------------
ok('url allows https', sanitizeVisitorUrl('https://shop.example.com/cart'), 'https://shop.example.com/cart');
ok('url allows http', sanitizeVisitorUrl('http://shop.example.com'), 'http://shop.example.com/');
ok('url trims', sanitizeVisitorUrl('  https://a.example  '), 'https://a.example/');
ok('url rejects javascript:', sanitizeVisitorUrl('javascript:alert(document.cookie)'), undefined);
ok('url rejects obfuscated javascript:', sanitizeVisitorUrl('java\nscript:alert(1)'), undefined);
ok('url rejects javascript: with casing', sanitizeVisitorUrl('JaVaScRiPt:alert(1)'), undefined);
ok('url rejects data:', sanitizeVisitorUrl('data:text/html,<script>alert(1)</script>'), undefined);
ok('url rejects vbscript:', sanitizeVisitorUrl('vbscript:msgbox(1)'), undefined);
ok('url rejects protocol-relative', sanitizeVisitorUrl('//evil.example'), undefined);
ok('url rejects file:', sanitizeVisitorUrl('file:///etc/passwd'), undefined);
ok('url rejects malformed', sanitizeVisitorUrl('not a url'), undefined);
ok('url rejects empty', sanitizeVisitorUrl('   '), undefined);
ok('url rejects non-string', sanitizeVisitorUrl(123), undefined);
ok('url rejects over-long instead of truncating', sanitizeVisitorUrl('https://a.example/' + 'x'.repeat(4096)), undefined);

// --- parseVisitorMetadata ---------------------------------------------------
ok('meta parses a normal blob', parseVisitorMetadata('{"visitorName":"kj","userAgent":"UA"}'), { visitorName: 'kj', userAgent: 'UA' });
ok('meta strips externalAuthToken', parseVisitorMetadata('{"externalAuthToken":"forged.jwt.token","visitorName":"kj"}'), { visitorName: 'kj' });
ok('meta rejects malformed json', parseVisitorMetadata('{oops'), {});
ok('meta rejects an array', parseVisitorMetadata('[1,2,3]'), {});
ok('meta rejects a scalar', parseVisitorMetadata('"nope"'), {});
ok('meta rejects non-string', parseVisitorMetadata({ visitorName: 'kj' }), {});
ok('meta rejects oversized raw', parseVisitorMetadata('{"x":"' + 'y'.repeat(VISITOR_METADATA_MAX) + '"}'), {});

// --- clampVisitorMetadata ---------------------------------------------------
ok('metadata caps the name',
  clampVisitorMetadata({ visitorName: 'n'.repeat(500) }).visitorName,
  'n'.repeat(VISITOR_NAME_MAX));
ok('metadata caps the email',
  clampVisitorMetadata({ visitorEmail: 'e'.repeat(500) }).visitorEmail,
  'e'.repeat(254));
ok('metadata drops a blank name', clampVisitorMetadata({ visitorName: '   ', visitorEmail: 'a@b.c' }), { visitorEmail: 'a@b.c' });
ok('metadata leaves unknown keys alone', clampVisitorMetadata({ plan: 'gold', visitorName: 'kj' }), { plan: 'gold', visitorName: 'kj' });

if (failures.length > 0) {
  console.error('check-visitor-input: FAILED\n');
  for (const failure of failures) console.error('  ' + failure);
  console.error('\nVisitor input is stored verbatim and rendered in the console — fix these before shipping.');
  process.exit(1);
}

console.log('check-visitor-input: OK — ' + 'all visitor-input rules hold.');
