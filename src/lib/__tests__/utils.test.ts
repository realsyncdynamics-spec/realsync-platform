import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn', () => {
  it('returns a single class name unchanged', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('joins multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('merges conflicting Tailwind classes (last wins)', () => {
    // tailwind-merge resolves padding conflicts
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('resolves conflicting text-color classes', () => {
    expect(cn('text-red-500', 'text-blue-600')).toBe('text-blue-600');
  });

  it('omits falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, null, '')).toBe('foo');
  });

  it('handles conditional classes via objects', () => {
    expect(cn({ 'font-bold': true, 'italic': false })).toBe('font-bold');
  });

  it('handles arrays of class names', () => {
    expect(cn(['flex', 'items-center'])).toBe('flex items-center');
  });

  it('returns empty string when given no truthy classes', () => {
    expect(cn(false, undefined, null)).toBe('');
  });

  it('merges Tailwind responsive variants correctly', () => {
    expect(cn('text-sm', 'md:text-base', 'text-lg')).toBe('md:text-base text-lg');
  });

  it('handles mixed conditional and static classes', () => {
    const isActive = true;
    const result = cn('btn', isActive && 'btn-active', 'rounded');
    expect(result).toBe('btn btn-active rounded');
  });
});
