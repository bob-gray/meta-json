meta-json
=========

JavaScript meta data for runtime behavior and static analysis

  + Embed meta data declared as JSON within JavaScript source
  + Wrap meta data with a `meta` function call
  + Include a `meta` function implementation
  + Utilize meta data at runtime to dictate behavior
  + Parse meta data statically to generate documentation tied directly to
    runtime behavior


Runtime API
-----------

The runtime API consists of a single function, `meta`, that accepts a single
argument, `data`. To allow for easy static anlysis, `data` must be a valid JSON
object literal. `meta` has no side effects. The purpose of `meta` is to make
parsing meta data easy and to provide a mechanism for runtime transformation of
meta data JSON, if necessary (see Data Transformation). `data` is passed through
and can then be used to dictate behavior.

The simpliest implementation of `meta` is:

    function meta (data) {
        return data;
    }


Static Analysis
---------------

The generation of documentation from the meta data is divided into 3 steps:


  1. **Parser**

    The first step in generating documentation using `meta` is the parser. The
    parser's only responsibility is to pull the meta data out of the source.
    The parser accepts a JavaScript source string and returns an array of meta
    data objects.
    
    This project includes a parser implementation.

  2. **Processor**

    The next step is the processor. The processor accepts an array of meta data
    objects returned from the parser and reduces it to an object. It may relate
    objects to other or fill in missing context or default values. The processor
    does whatever needs to be done to prepare the meta data to be handed to the
    reporter.

    Implementations of processor will be dependent upon the structure or schema
    of the meta data. This project does not include a processor implementation.

  3. **Reporter**

    The last step is the reporter. The reporter accepts a meta data object from
    the processor and generates a documentation report.

    Implementations of reporter will be dependent upon the structure or schema
    of the meta data. This project does not inclue a reporter implementation.


Options Pattern
---------------

A common pattern in JavaScript is to pass an argument into a function using an
object literal. Often this argument is named `options`. Because `meta` returns
an object, functions that follow this pattern can have their `options` supplied by
`meta`. Static analysis can easily parse out the *same* `options` as runtime
evaluation. This ties documentation directly to runtime behavior.

Consider the example below where a method is attached to a class using `meta`.
`myClass.method` is defined elsewhere and it accepts two arguments. An object,
`options`, and a function which will serve as the resulting method's
implementation.
    
    myClass.method(
        meta({
            "name": "set",
            "type": "method",
            "signature": "string, any"
            "description": "Sets the value of a property"
        }),
        function () {
            ...
        }
    );


Data Transformation
-------------------

Sometimes, to be most useful at runtime, meta data needs to be complex values
that cannot be declared using JSON. For example a constructor function or
regular expression. In these cases the implementation of `meta` could transform
simple values to complex values where needed. It could transform a string module
name into a module value using `require` or create a `RegExp` instance from a
regular expression source string.

Two important aspects of meta data transformation to consider:

  1. `meta` function is sychronous
  2. Every meta data member should be meaningful as JSON


In or Out of Comments
---------------------

Sometimes it won't always be feasible to utilized meta data at runtime as in the
options pattern example above. Because it is just JavaScript, `meta` is
extremely flexible and can be place anywhere in source. All of the following
usages are valid:

    meta({
        "path": "some/where/important",
        "awesome": true
    });

    /*meta({
        "path": "some/where/important",
        "awesome": true
    })*/

    var config = meta({
        "path": "some/where/important",
        "awesome": true
    });


--------------------------------------------------------------------------------


Why JSON?
---------

  + **JSON is a subset of JavaScript**

    One language to read and write for both implementation and documentation

  + **Well suited for static analysis**

    There are a plethora of tools for working with JSON in many languages

  + **Available at runtime**

    JSON is JavaScript so utilizing meta data at runtime is easy and requires no
    special tools



Why not javadocs?
-----------------

In the context of JavaScript source, JSON is more machine-readable and
human-readable than javadoc comments.

My experience maintaining javadoc comments within JavaScript motivated me to
imagine a better way to document JavaScript. Javadoc style comments are good
but not the most elegant solution for JavaScript. They are more likely to
be maintained than external documentation but can easily become outdated
or contain errors because they are not directly tied to runtime behavior.