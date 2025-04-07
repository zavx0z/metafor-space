
<a name="readmemd"></a>

**MetaFor v1.3.15**

***

# MetaFor v1.3.15

## Classes

- [Meta](#classesmetamd)

## Type Aliases

- [BroadcastMessage](#type-aliasesbroadcastmessagemd)

## Functions

- [MetaFor](#functionsmetaformd)


<a name="classesmetamd"></a>

[**MetaFor v1.3.15**](#readmemd)

***

[MetaFor](#readmemd) / Meta

# Class: Meta\<S, C, I\>

Meta - класс частицы

## Type Parameters

### S

`S` *extends* `string`

Состояния

### C

`C` *extends* `Record`\<`string`, `any`\>

Контекст

### I

`I` *extends* `Record`\<`string`, `any`\>

Ядро

## Constructors

### Constructor

> **new Meta**\<`S`, `C`, `I`\>(`params`): `Meta`\<`S`, `C`, `I`\>

#### Parameters

##### params

`MetaConstructor`\<`S`, `C`, `I`\>

#### Returns

`Meta`\<`S`, `C`, `I`\>

## Properties

### id

> **id**: `string`

Идентификатор частицы

***

### title?

> `optional` **title**: `string`

Заголовок частицы

***

### description?

> `optional` **description**: `string`

Описание частицы

***

### state

> **state**: `S`

Состояние частицы

***

### context

> **context**: `Partial`\<\{ \[K in string \| number \| symbol\]: any \}\>

Контекст частицы

***

### states

> **states**: readonly `S`[]

Состояния частицы

***

### types

> **types**: `Record`\<`string`, `any`\>

Типы частицы

***

### transitions

> **transitions**: `Transitions`\<`C`, `S`\>

Переходы частицы

***

### actions

> **actions**: `Actions`\<`C`, `I`\>

Действия частицы

***

### core

> **core**: `Core`\<`I`\>

Ядро частицы

***

### reactions

> **reactions**: `ReactionType`\<`C`, `I`\>

Реакции частицы

***

### channel

> **channel**: `BroadcastChannel`

Канал частицы

***

### process

> **process**: `boolean`

Флаг процесса частицы

***

### component

> **component**: `Element`

Компонент частицы

***

### update()

> **update**: (`context`) => `void`

Обновление частицы

#### Parameters

##### context

`Partial`\<\{ \[K in string \| number \| symbol\]: C\[K\] extends EnumDefinition\<T\> ? any\[any\]\["nullable"\] extends true ? null \| T\[number\] : null \| T\[number\] : C\[K\] extends TypeDefinition ? any\[any\]\["nullable"\] extends true ? null \| ExtractTypeValue\<any\[any\]\> : null \| ExtractTypeValue\<any\[any\]\> : never \}\>

#### Returns

`void`

***

### \_updateExternal()

> **\_updateExternal**: (`params`) => `void`

Обновление частицы из вне

#### Parameters

##### params

###### context

`Partial`\<\{ \[K in string \| number \| symbol\]: C\[K\] extends EnumDefinition\<T\> ? any\[any\]\["nullable"\] extends true ? null \| T\[number\] : null \| T\[number\] : C\[K\] extends TypeDefinition ? any\[any\]\["nullable"\] extends true ? null \| ExtractTypeValue\<any\[any\]\> : null \| ExtractTypeValue\<any\[any\]\> : never \}\>

###### srcName?

`string`

###### funcName?

`string`

#### Returns

`void`

***

### onUpdate()

> **onUpdate**: (`listener`) => () => `void`

Обработчик обновления частицы

#### Parameters

##### listener

(`context`) => `void`

#### Returns

> (): `void`

##### Returns

`void`

***

### onTransition()

> **onTransition**: (`listener`) => () => `void`

Обработчик перехода частицы

#### Parameters

##### listener

(`oldState`, `newState`) => `void`

#### Returns

> (): `void`

##### Returns

`void`

***

### snapshot()

> **snapshot**: () => `Snapshot`\<`C`, `S`\>

Снимок частицы

#### Returns

`Snapshot`\<`C`, `S`\>

***

### graph()

> **graph**: () => `Promise`\<`any`\>

Граф частицы

#### Returns

`Promise`\<`any`\>

***

### destroy()

> **destroy**: () => `void`

Уничтожение частицы

#### Returns

`void`


<a name="functionsmetaformd"></a>

[**MetaFor v1.3.15**](#readmemd)

***

[MetaFor](#readmemd) / MetaFor

# Function: MetaFor()

> **MetaFor**(`tag`, `conf`?): `object`

# MetaFor - мета для ... 

Создает класс/коллекцию Мета - которые порождают сущности - называемые meta.

> Декларативное описание сущности и её поведения  

## Основные составляющие:
- Состояния
- Контекст
- Переходы между состояниями
- Ядро
- Действия
- Функция создания частицы

## Дополнительные составляющие:
- Представление отображения частицы
- Реакции на изменения других частиц

> Meta (класс/коллекция) порождает meta (актор/сущность) при вызове метода create

## Parameters

### tag

`string`

Имя частицы

### conf?

Конфигурация частицы

#### description?

`string`

Описание частицы

#### development?

`boolean`

Режим разработки (подключена валидация)

## Returns

`object`

### states()

> **states**: \<`S`\>(...`states`) => `object`

#### Type Parameters

##### S

`S` *extends* `string`

#### Parameters

##### states

...`S`[]

#### Returns

`object`

##### context()

> **context**: \<`C`\>(`context`) => `object`

###### Type Parameters

###### C

`C` *extends* `ContextDefinition`

###### Parameters

###### context

(`types`) => `C`

###### Returns

`object`

###### transitions()

> **transitions**: (`transitions`) => `object`

###### Parameters

###### transitions

`Transitions`\<`C`, `S`\>

###### Returns

`object`

###### core()

> **core**: \<`I`\>(`core`) => `object`

###### Type Parameters

###### I

`I` *extends* `CoreObj`

###### Parameters

###### core

`CoreDefinition`\<`I`, `C`\> = `...`

###### Returns

`object`

###### actions()

> **actions**: (`actions`) => `object`

###### Parameters

###### actions

`Actions`\<`C`, `I`\>

###### Returns

`object`

###### reactions()

> **reactions**: (`reactions`) => `object`

###### Parameters

###### reactions

`ReactionType`\<`C`, `I`\>

###### Returns

`object`

###### view()

> **view**: (`view`) => `object`

###### Parameters

###### view

`ViewDefinition`\<`I`, `C`, `S`\>

###### Returns

`object`

###### create()

> **create**: (`data`) => [`Meta`](#classesmetamd)\<`S`, `C`, `I`\>

###### Parameters

###### data

`CreateParams`\<`C`, `S`, `I`\>

###### Returns

[`Meta`](#classesmetamd)\<`S`, `C`, `I`\>

###### create()

> **create**: (`data`) => [`Meta`](#classesmetamd)\<`S`, `C`, `I`\>

###### Parameters

###### data

`CreateParams`\<`C`, `S`, `I`\>

###### Returns

[`Meta`](#classesmetamd)\<`S`, `C`, `I`\>

###### view()

> **view**: (`view`) => `object`

###### Parameters

###### view

`ViewDefinition`\<`I`, `C`, `S`\>

###### Returns

`object`

###### create()

> **create**: (`data`) => [`Meta`](#classesmetamd)\<`S`, `C`, `I`\>

###### Parameters

###### data

`CreateParams`\<`C`, `S`, `I`\>

###### Returns

[`Meta`](#classesmetamd)\<`S`, `C`, `I`\>

###### create()

> **create**: (`data`) => [`Meta`](#classesmetamd)\<`S`, `C`, `I`\>

###### Parameters

###### data

`CreateParams`\<`C`, `S`, `I`\>

###### Returns

[`Meta`](#classesmetamd)\<`S`, `C`, `I`\>

## Include Example

tests/metafor.spec.ts


<a name="type-aliasesbroadcastmessagemd"></a>

[**MetaFor v1.3.15**](#readmemd)

***

[MetaFor](#readmemd) / BroadcastMessage

# Type Alias: BroadcastMessage

> **BroadcastMessage** = `object`

Сообщение для обмена данными между частицами

## Properties

### meta

> **meta**: `object`

Метаданные сообщения

#### particle

> **particle**: `string`

#### func

> **func**: `string`

#### target

> **target**: `string`

#### timestamp

> **timestamp**: `number`

***

### patch

> **patch**: `Patch`

Патч для применения к частице
