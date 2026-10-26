/**
 * When a scroll-triggered reveal fires: as soon as the element's top edge is a
 * little way up the screen, however tall the element is.
 *
 * A fraction-of-the-element threshold (framer's `amount: 0.2`) can never be met
 * by a block taller than the viewport divided by that fraction. On a phone the
 * stats page's project list and revenue section are each over five screens
 * tall, so they stayed at opacity 0 and scrolled past as blank space.
 */
export const revealViewport = {
  amount: 'some',
  margin: '0px 0px -10% 0px',
}
