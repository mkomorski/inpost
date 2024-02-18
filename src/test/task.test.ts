import test from 'ava';

import { CORRECT as expectedResult } from '../correctResult';
import { getCategories } from '../mockedApi';
import { categoryTree } from '../task';

test('should return proper order', async (t) => {
  const result = await categoryTree(getCategories);
  if (!result[0] || !expectedResult[0]) {
    t.pass();
  }
  t.is(result[0].id, expectedResult[0].id);
  const childrenOrder = result[0].children.map((child) => child.id);
  const expectedChildrenOrder = expectedResult[0].children.map(
    (child) => child.id
  );
  t.deepEqual(childrenOrder, expectedChildrenOrder);

  const nestedChildrenOrder = result[0].children
    .flatMap((child) => child.children)
    .map((ch) => ch.id);
  const nestedExpectedChildrenOrder = expectedResult[0].children
    .flatMap((child) => child.children)
    .map((ch) => ch.id);
  t.deepEqual(nestedChildrenOrder, nestedExpectedChildrenOrder);
});
