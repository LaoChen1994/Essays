function* gen() {
    yield 1;
    yield 2;

    return 3;
}

const g = gen();

console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())