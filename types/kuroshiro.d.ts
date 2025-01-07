declare module 'kuroshiro' {
    class Kuroshiro {
      init(analyzer: any): Promise<void>;
      convert(text: string, options: { to: string }): Promise<string>;
    }
    export default Kuroshiro;
  }