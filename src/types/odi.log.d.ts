/* 
  Typescript declarions for ODI Leeds logging script
  https://odileeds.org/resources/odi.log.js
  Version: 2021-01-05Version: 2021-01-05
*/

declare namespace ODI {
  const log: {
    setup(opt: { id: string; dest?: string; target?: string | string[] }): void;
    add(txt: string, cb?: Function): void;
  };
}
