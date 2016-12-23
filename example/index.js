/* FRAMEWORK ******************************************************************/

class Field {
  _value: any;
  value: any;

  constructor (...args) {
    this._value = null;
    Object.defineProperty(this, 'value', {
      get: () => this._value,
      set: (v) => this._value = v,
      enumerable: true
    });
  }
}

class Document {
  context: any;
  static context: any;

  constructor (...args) {}

  setValidator (...args) {}

  setHandler (...args) {}

  defineField (name, options?) {
    let field = new Field();
    
    Object.defineProperty(this, name, {
      get: () => field.value,
      set: (v) => field.value = v,
      enumerable: true,
      configurable: true
    });
  }

  populate (data?) {}
}

class Context {
  constructor (...args) {}

  defineProperty(name: string, descriptor: any) {
    return Object.defineProperty(this, name, descriptor);
  }

  defineModel(Model: Function): any {
    let name: string = (Model.prototype.constructor as any).name;

    let Klass = eval(`class ${name} extends Model {}`);
    Klass.prototype.context = this;
    Klass.context = this;
    
    return this.defineProperty(name, {
      get: () => Klass
    });
  }

}

/* MODELS *********************************************************************/

class Book extends Document {
  public title: string;

  constructor (data?) {
    super();
    this.defineField('title', {type: 'String'});
    this.populate(data);
  }
}

class User extends Document {
  public name: string;
  public books: Book[];

  constructor (data?) {
    super();
    this.setValidator('isCool', () => true);
    this.setHandler('404', () => false);
    this.defineField('name', {type: 'String'});
    this.defineField('book', {type: [Book]});
    this.populate(data);
  }
}

/* CONTEXT ********************************************************************/

class App extends Context {
  public mongo: any;
  public userId: number;

  constructor (userId: number) {
    super();
    this.defineProperty('mongo', () => null);
    this.defineProperty('userId', () => userId);
    this.defineModel(User);
    this.defineModel(Book);
  }
}

/* USAGE **********************************************************************/

function echo () {
  let m = new User();
  m.name;
  m.context

}
echo();
