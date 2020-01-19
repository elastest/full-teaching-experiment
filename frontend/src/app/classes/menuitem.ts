export class Menuitem {

  private _title: string;
  private _path: string;
  private _icon: string;


  constructor(title: string, path: string, icon: string) {
    this._title = title;
    this._path = path;
    this._icon = icon;
  }


  get title(): string {
    return this._title;
  }

  get path(): string {
    return this._path;
  }

  get icon(): string {
    return this._icon;
  }
}
