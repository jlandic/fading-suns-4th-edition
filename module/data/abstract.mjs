export default class SystemDataModel extends foundry.abstract.TypeDataModel {
  static mergeSchema(a, b) {
    Object.assign(a, b);
    return a;
  }
}

export class ActorDataModel extends SystemDataModel {}
