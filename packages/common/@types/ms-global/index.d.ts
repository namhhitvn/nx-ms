type ObjectLiteral = {
  [key: keyof any]: any;
};

type WithLeast<T, K extends keyof T> = Omit<Partial<T>, K> & Pick<T, K>;

type WithRequired<T, K extends keyof T> = Omit<Partial<T>, K> & Required<Pick<T, K>>;

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type WithWritable<T> = { -readonly [K in keyof T]: T[K] } & {
  [key: string]: any;
};

interface Constructor<T = any> {
  new (...args: any[]): T;
  prototype: T;
}
