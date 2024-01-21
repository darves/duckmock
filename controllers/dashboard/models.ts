import { mockableProperty } from "../../src/reflection-helpers/mockabel-property.property-decorator";
import { Mockable } from "../../src/reflection-helpers/mockable.decorator";
import { PropertyMockType } from "../../src/core/property-mock-type.enum";
import { mockableTypeOf } from "../../src/reflection-helpers/type-of.property-decorator";
import { mockableArrayTypeOf } from "../../src/reflection-helpers/array-type-of.property-decorator";

enum SomeEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}

@Mockable()
class Amount {
  @mockableProperty({
    mockType: PropertyMockType.Number,
    mockAdditional: {
      min: 1,
      max: 1000000
    }
  })
  value: number = 0;

  currency = 'USD'
}

@Mockable()
export class DashboardUserModel {
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

  @mockableProperty({
    mockType: PropertyMockType.Address,
    mockAdditional: {
      min: 1,
      max: 10000
    }
  })
  numberOfPosts!: number;

  @mockableTypeOf(() => Amount)
  amount!: Amount;

  @mockableArrayTypeOf(() => Amount)
  amountArray!: Amount[];

  @mockableProperty({
    mockType: PropertyMockType.Date,
    mockAdditional: {
      start: new Date(2018, 1, 1).toString(),
      end: new Date(2018, 12, 31).toString()
    }
  })
  dateOfBirth!: Date;

  @mockableProperty({
    mockType: PropertyMockType.EnumValue,
    mockAdditional: SomeEnum
  })
  someEnum!: SomeEnum;
}
