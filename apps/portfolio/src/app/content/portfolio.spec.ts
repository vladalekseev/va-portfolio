import { portfolio, resolveContactLink } from './portfolio';

describe('resolveContactLink', () => {
  it('prefers email when an address is set', () => {
    expect(
      resolveContactLink({ ...portfolio, email: 'hello@example.com' }),
    ).toEqual({ label: 'Email me', href: 'mailto:hello@example.com' });
  });

  it('falls back to the first profile link without an email', () => {
    expect(
      resolveContactLink({
        ...portfolio,
        email: null,
        links: [{ label: 'LinkedIn', href: 'https://linkedin.example' }],
      }),
    ).toEqual({
      label: 'Message me on LinkedIn',
      href: 'https://linkedin.example',
    });
  });

  it('returns null when there is no way to get in touch', () => {
    expect(resolveContactLink({ ...portfolio, email: null, links: [] })).toBe(
      null,
    );
  });
});
