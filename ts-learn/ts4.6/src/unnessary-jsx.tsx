export const C = () => <div>123</div>;

export const D = () => {
  return Array(10).map((t, i) => (i % 2 === 0 ? <C /> : null));
};
