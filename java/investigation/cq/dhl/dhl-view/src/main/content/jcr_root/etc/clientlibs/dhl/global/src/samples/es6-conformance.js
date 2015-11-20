/*global console */
function testAssert(condition, text) {
    if (condition === true) {
        console.log(text + ' OK');
    } else {
        console.log(text + ' failed');
    }
}

/**
 *  Object.find()
 */

try {
    var arrayOfObjects = [
        {id: 'zh', name: 'Chinese'},
        {id: 'en', name: 'English'},
        {id: 'ar', name: 'Arabic'}
    ];

    var foundObject = arrayOfObjects.find(
        function (elem) {
            return elem.id === 'en';
        });

    testAssert(foundObject.id === 'en', 'Object.find()');
} catch (ex) {
    console.log('Object.find() failed');
}

/**
 *  Let, Const
 */

try {
    const myConst = 5;
    let myLet = 5;

    testAssert(myConst === myLet, 'Const and Let');
} catch (ex) {
    console.log('Let, Const failed');
}

/**
 *  Arrow Functions
 */

try {
    testAssert(((v) => v * 5)(5) === 25, 'Arrow Functions');
} catch (ex) {
    console.log('Arrow Functions failed');
}

/**
 *  Block Scoped Binding
 */

try {
    const tmp = 42;

    {
        const tmp = 43;
        console.log(tmp === 43);
    }

    testAssert(tmp === 42, 'Block Scoped Binding');
} catch (ex) {
    console.log('Block Scoped Binding failed');
}

/**
 *  Computed Property Names
 */

try {
    var obj = {
        [ 'prop_' + (() => 42)() ]: 42
    };

    testAssert(obj.prop_42 === 42, 'Computed Property Names');
} catch (ex) {
    console.log('Computed Property Names failed');
}

/**
 *  Default Parameters
 */

try {
    function f(x, y=12) {
        // y is 12 if not passed (or passed as undefined)
        return x + y;
    }

    testAssert(f(3) === 15, 'Default Parameters');
} catch (ex) {
    console.log('Default Parameters failed');
}

/**
 *  Destructuring Assignment
 */

try {
    var [a, , b] = [1, 2, 3];

    testAssert(a === 1 && b === 3, 'Destructuring');
} catch (ex) {
    console.log('Destructuring Assignment failed');
}


/**
 *  For Of Loop
 */

try {
    var res = [];
    for (var element of [1, 2, 3]) {
        res.push(element * element);
    }

    testAssert(res.length === 3 && res[0] === 1 && res[1] === 4 && res[2] === 9, 'For Of Loop');
} catch (ex) {
    console.log('For Of Loop failed');
}


/**
 *  Property Method Syntax
 */

try {
    var propMethodTest = {
        value: 42,
        toString() {
            return this.value;
        }
    };

    testAssert(propMethodTest.toString() === 42, 'Property Method Syntax');
} catch (ex) {
    console.log('Property Method Syntax failed');
}

/**
 *  Object Initializer Shorthand
 */

try {
    function getPoint() {
        const x = 1;
        const y = 10;

        return {x, y};
    }

    testAssert(getPoint().x ===1 && getPoint().y === 10, 'Object Initializer Shorthand');
} catch (ex) {
    console.log('Object Initializer Shorthand failed');
}

/**
 *  Rest Parameters
 */

try {
    function push(array, ...items) {
        items.forEach(function(item) {
            array.push(item);
        });
    }
    const result = [];
    push(result, 1, 2, 3);

    testAssert(result.length === 3 &&
                result[0] === 1 &&
                result[1] === 2 &&
                result[2] === 3, 'Rest Parameters');
} catch (ex) {
    console.log('Rest Parameters failed');
}

/**
 *  Spread
 */

try {
    function add(x, y) {
        return x + y;
    }

    const numbers = [4, 38];
    testAssert(add(...numbers) === 42, 'Spread');
} catch (ex) {
    console.log('Spread failed');
}

/**
 *  Template Strings
 */

try {
    const name = 'Bob';
    const question = 'life';
    testAssert(`Hello ${name}, how is ${question}?` === 'Hello Bob, how is life?', 'Template Strings');
} catch (ex) {
    console.log('Template Strings failed');
}


/**
 *  Classes and Inheritance
 */

try {
    class User {
        constructor(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }
    }

    class AdminUser extends User {
        constructor(firstName, lastName, role) {
            super(firstName, lastName);
            this.role = role;
        }
    }

    //test:
    const myAdmin = new AdminUser('John', 'Smith', 'superadmin');
    testAssert(myAdmin.lastName === 'Smith', 'Classes and Inheritance');
} catch (ex) {
    console.log('Classes and Inheritance failed');
}

/**
 *  Getters and Setters
 */

try {
    class User {
        constructor(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }

        get fullName() {
            return this.firstName + ' ' + this.lastName;
        }
    }

    //test:
    const myUser = new User('John', 'Smith');
    testAssert(myUser.fullName === 'John Smith', 'Getters and Setters');
} catch (ex) {
    console.log('Getters and Setters failed');
}

/**
 *  Promises
 */

try {
    const promise = new Promise(function (resolve, reject) {
        // do a thing, possibly async, then…
        const result = 5 === 5;

        if (result) {
            resolve('Stuff worked!');
        }
        else {
            reject(Error('It broke'));
        }
    });

    // test:
    promise.then(function (result) {
        testAssert(result === 'Stuff worked!', 'Promises');
    }, function (err) {
        console.log(err);
    });
} catch (ex) {
    console.log('Promises failed');
}

