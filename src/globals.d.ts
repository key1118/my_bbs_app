// CSS モジュール用の型定義
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
