## Association
```
   Foo.hasOne(Bar);
   Bar.belongsTo(Foo);
```
- In this case, Sequelize knows that a `fooId` column must be added to `Bar`
- Default the association is optional, in other words, the `fooId` can be null
### Custom the foreign key
```
Foo.hasOne(Bar, {
  foreignKey: 'myFooId',
});
Bar.belongsTo(Foo);

// Option 2
Foo.hasOne(Bar);
Bar.belongsTo(Foo, {
  foreignKey: 'myFooId',
});

```

### Eager and Lazy loading
```
#Lazy
const awesomeCaptain = await Captain.findOne({
  where: {
    name: 'Jack Sparrow',
  },
});
const hisShip = await awesomeCaptain.getShip();

#Eager
const awesomeCaptain = await Captain.findOne({
  where: {
    name: 'Jack Sparrow',
  },

  <!--  or include model name => include: 'ship' -->
  include: Ship,
});

```
### Define an alias
```
Ship.belongsTo(Captain, { as: 'leader', foreignKey: 'bossId' });

// Since an alias was defined
await Ship.findAll({ include: Captain }) // Throws an error
// Instead, you have to pass the alias:
await Ship.findAll({ include: 'leader' })
// or
await Ship.findAll({
      include: {
        model: Captain,
        as: 'leader',
      },
    })
```

### Why define association in pair
```
// This works...
await Foo.findOne({ include: Bar });

// But this throws an error:
await Bar.findOne({ include: Foo });
// SequelizeEagerLoadingError: foo is not associated to bar!
```

### update 14/6/2024
- sort issue