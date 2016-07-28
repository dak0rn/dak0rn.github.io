---
title: "Elegant model validation with Lumen"
date: 2016-01-23
---
![http://imgs.xkcd.com/comics/exploits_of_a_mom.png](http://imgs.xkcd.com/comics/exploits_of_a_mom.png)

Lumen (and Laravel, too!) provides a lot of things that makes developer's lifes easier including a [Validator](https://laravel.com/docs/5.1/validation). It is an *out of the box* solution that comes with a lot of handy [rules](https://laravel.com/docs/5.1/validation#available-validation-rules) and is quite easy to use:

```php
<?php
use Validator;

// ...

$data = [
    "name" => "John Doe",
    "email" => "' OR 1=1 --"
];

$rules = [
  "name" => "required",
  "email" => "required|email",
  "age" => "required|numeric"
];

$validator = Validator::make($data, $rules);

if( ! $validator->passes() )
  throw new BadRequestHttpException('invalid');
```

Basically, one creates a Validator with the data to check and a set of rules and can then ask it whether the data passes the rules or not. While this is simple to use, passing the rules every time one wants to validate something does not keep the code DRY. And there is no idea of centralizing the rules.

## A model class
To make this more maintainable, we created an abstract model class that provides a way to validate the model's values with rules defined in the model. We named this class `BaseModel`.

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Validator;

abstract class BaseModel extends Model {

    /**
     * List of properties to validate
     * Format:
     *      property => validation rules
     *
     * Rule list:
     * https://laravel.com/docs/5.1/validation#available-validation-rules
     */
    protected $rules = [];

    // ... other stuff ...

    /**
     * Returns `true` if the model's set properties are valid.
     *
     * @return  {boolean}  `true` if valid
     */
    public function isValid() {
        $values = [];

        // Copy all defined properties
        foreach ($this->rules as $prop => $_ ) {
            $values[$prop] = $this->$prop;
        }

        $validator = Validator::make($values, $this->rules);

        return $validator->passes();
    }

}
```

`BaseModel` uses a `$rules` property meant to be set by sub classes. It is the place where the validation rules are defined.

It then provides an `isValid()` function that takes the defined rules, grabs the corresponding properties and validates them with Lumen's Validator.

Validating input is way easier and rules are kept at a central location - in the models.

```php
<?php
// in a controller
public function updateUserMail(Request $request, $uid) {
    $user = User::find($uid);

    $email = $request->input('email');

    $user->email = $email;

    if( ! $user->isValid() )
        throw new BadRequestHttpException('invalid');

    $user->save();

    return response()->json([ 'updated' => true ]);
}
```