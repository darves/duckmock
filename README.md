# DUCKMOCK Library Documentation

## Overview
DUCKMOCK is a library designed to simplify the creation of mock API endpoints. By following the specified folder structure and naming conventions, developers can quickly set up mock endpoints for frontend development and testing.

## Getting Started
To use DUCKMOCK, create a folder structure within your project as shown below. This structure is crucial for the library to correctly identify and expose the mock endpoints.

```
DUCKMOCK
└── controllers
    ├── dashboard
    │   ├── dashboard.controller.ts
    │   └── models.ts
    └── order
        └── order.controller.ts
```

### Folder Structure
- **controllers**: This directory contains all the controller subdirectories for your mock endpoints.
- **dashboard**: A subdirectory for the dashboard-related mock endpoint.

### Implementing a Mock Controller

The `dashboard.controller.ts` file defines a controller that returns a configuration for the mock endpoint:

```typescript
import { MockController } from "../../src/core/mock-controller.interface";
import { MockEndpointConfig } from "../../src/core/mock-endpoint-config";
import { MockEndpointType } from "../../src/core/mock-endpoint-type.enum";
import { DashboardUserModel } from "./models";

class DashboardController implements MockController {
  [methodName: string]: () => MockEndpointConfig;

  get() {
    return {
      model: DashboardUserModel,
      type: MockEndpointType.GetList,
    };
  }
}

export default DashboardController;
```

### Defining Models with Decorators

In `models.ts`, models are defined using decorators that specify how each property should be mocked:

```typescript
import { Mockable } from "../../src/reflection-helpers/mockable.decorator";
import { mockableProperty } from "../../src/reflection-helpers/mockabel-property.property-decorator";
import { PropertyMockType } from "../../src/core/property-mock-type.enum";

enum SomeEnum {
  A = 'A',
  B = 'B',
  // Other enum values...
}

@Mockable()
class DashboardUserModel {
  @mockableProperty({
    mockType: PropertyMockType.FirstName
  })
  firstName!: string;
  @mockableProperty({
    mockType: PropertyMockType.LastName
  })
  lastName!: string;
  @mockableProperty({
    mockType: PropertyMockType.Email
  })
  email!: string;
  // ... other properties
}
```

### API Response Example

Making a request to `app.github.dev/dashboard?_filter=someEnum==A;firstName=like=p&_page=1&_size=2` would yield a response with a paginated list of items that match the filter criteria. Here's an example of a response:

```json
{
  "page": 1,
  "pageSize": 2,
  "count": 5,
  "totalCount": 200,
  "items": [
    {
      "firstName": "Sophia",
      "lastName": "Payne",
      // ... other fields
      "someEnum": "A",
      "id": 11
    },
    // ... additional items
  ]
}
```

This response includes pagination information (`page`, `pageSize`, `count`, `totalCount`) and an array of `items` that represent the data for each mock user matching the filter criteria.

### Defining Models with Decorators

In DUCKMOCK, models are defined as classes with properties that represent the shape of your data. Decorators from the library are used to annotate these properties to indicate how they should be mocked.

#### Basic Model Structure

Each model class should be decorated with `@Mockable`, which flags the class for mocking. Properties within these classes can then be decorated with `@mockableProperty` and related decorators to specify the type of mock data they should hold.

Here is a breakdown of the decorators and how they can be applied:

#### Enum Property

Use the `PropertyMockType.EnumValue` type to mock properties that should hold an enum value. The `mockAdditional` field specifies the enum to use.

```typescript
enum SomeEnum {
  A = 'A',
  B = 'B',
  // Other enum values...
}

@Mockable()
class DashboardUserModel {
  // ...

  @mockableProperty({
    mockType: PropertyMockType.EnumValue,
    mockAdditional: SomeEnum
  })
  someEnum!: SomeEnum;
}
```

#### Numeric Property

For numeric properties, `PropertyMockType.Number` can be used, with `min` and `max` values provided to define a range for the mock numbers.

```typescript
@Mockable()
class DashboardUserModel {
  // ...

  @mockableProperty({
    mockType: PropertyMockType.Number,
    mockAdditional: {
      min: 1,
      max: 1000000
    }
  })
  numberOfPosts!: number;
}
```

#### String Property

String properties can be mocked as first names, last names, emails, addresses, etc., by specifying the corresponding `PropertyMockType`.

```typescript
@Mockable()
class DashboardUserModel {
  // ...

  @mockableProperty({
    mockType: PropertyMockType.FirstName
  })
  firstName!: string;

  @mockableProperty({
    mockType: PropertyMockType.LastName
  })
  lastName!: string;

  @mockableProperty({
    mockType: PropertyMockType.Email
  })
  email!: string;
}
```

#### Date Property

Dates can be mocked by specifying a start and end date, from which a random date will be chosen.

```typescript
@Mockable()
class DashboardUserModel {
  // ...

  @mockableProperty({
    mockType: PropertyMockType.Date,
    mockAdditional: {
      start: new Date(2018, 0, 1).toString(), // Note: Month is 0-indexed
      end: new Date(2018, 11, 31).toString()
    }
  })
  dateOfBirth!: Date;
}
```

#### Complex Object Property

If a property is a complex type, use decorators like `@mockableTypeOf` to reference another mockable class.

```typescript
@Mockable()
class Amount {
  @mockableProperty({
    mockType: PropertyMockType.Number,
    mockAdditional: {
      min: 1,
      max: 1000000
    }
  })
  value!: number;

  currency!: string;
}

@Mockable()
class DashboardUserModel {
  // ...

  @mockableTypeOf(() => Amount)
  amount!: Amount;

  @mockableArrayTypeOf(() => Amount)
  amountArray!: Amount[];
}
```

## Conclusion

With DUCKMOCK, creating mock endpoints is a matter of defining the appropriate folder structure, implementing controller and model files, and utilizing our powerful decoration system to specify the mock data. This allows for a flexible and rapid development process, supporting a wide range of mocking scenarios.