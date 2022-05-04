interface IAddItem {
  name: string;
  age: number;
  dept: string;
}

interface IEdit extends IAddItem {
  id: number;
}

interface Reducer {
  add: IAddItem;
  edit: IEdit;
  delete: boolean;
}

type UserAction<K extends keyof Reducer = keyof Reducer> = {
  [P in K]: {
    action: P;
    handler: (value: Reducer[P]) => void;
  };
}[K];

const reducer = <K extends keyof Reducer>(value: UserAction<K>) => {};

reducer({
  action: "edit",
  handler: (value) => {
    console.log(value.id);
  },
});

type UserAction2<T extends object, K extends keyof T = keyof T> = {
  [P in K]: {
    action: P;
    handler: (value: T[P]) => void;
  };
}[K];

const reducer2 = (value: UserAction2<Reducer>) => {};

reducer2({
  action: "edit",
  handler: (value) => {
    console.log(value.id);
  },
});
