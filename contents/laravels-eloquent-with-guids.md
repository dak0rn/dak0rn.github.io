---
title: "Laravel's Eloquent with GUIDs"
date: 2016-02-01
---
Laravel's Eloquent is a really great ORM that makes working with a relational database a real pleasure. It works out of the box with auto incremented primary keys for models but it is quite simple to use a different kind, too. In our case, we needed GUIDs (`uniqueidentifier` in SQL Server).

Moving to GUIDs/UUIDs is easy. Laravel's Schema builder actually provides an `uuid()` type that uses UUIDs if natively available.

```php
// In migration file
$table->uuid('idUser')->default( DB::raw('NewID()') );
$table->primary('idUser');
```

Now that you do no longer use a auto incremented key you have to tell Eloquent about that. The `$incrementing` key has acutally to be `public`. If you omit this you will experience weird behavior sometimes.

```php
/**
 * We do not use a auto incremented key here!
 */
public $incrementing = false;
```

While this works fine so far, there is still something that causes trouble; if you create a model in the database the new primary key will not be set in the model instance. Even though we use `DEFAULT NewID()` for the key, the generated ID will not be available in the model after creation. The reason for that can be found in the [Model sources](https://github.com/illuminate/database/blob/master/Eloquent/Model.php#L1639-L1651):

![Laravel Model source](/images/laravel-model.png)

The tl;dr of this: if you do not use auto incremented keys provide them manually. The idea is now to manually select a GUID from the database, set it as the model's primary key and store it in the database afterwards. This is especially required if you want to attach relationships are creating a new model since the primary key would not be available then.

Luckily, Eloquent provides a quite elegant way to accomplish that; the model's static `boot` function. A creation handler is registered there which does the GUID obtaining. It also takes care of differently named primary keys. The code is stored in a model all other models are inheriting from.

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;

abstract class BaseModel extends Model {

    /**
     * We do not use a auto incremented key here!
     */
    public $incrementing = false;

    /**
     * Boot function of the model
     */
    public static function boot() {
        parent::boot();

        // Hook when a model is created
        static::creating(function ($model) {
            // Select a new ID
            $result = DB::select( DB::raw('Select NewID() NewUUID') );

            $model->{$model->getKeyName()} = $result[0]->NewUUID;
        });
    }

}
```