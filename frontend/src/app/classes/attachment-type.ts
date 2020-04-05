import {FileType} from "../enum/file-type.enum";

export class AttachmentType {

  private _name: string;
  private _typeId: FileType;


  constructor(name: string, type: FileType) {
    this._name = name;
    this._typeId = type;
  }


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get typeId(): number {
    return this._typeId;
  }

  set typeId(value: number) {
    this._typeId = value;
  }
}
