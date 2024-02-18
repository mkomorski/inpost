import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

const parseOrder = (item): number => {
  const result = parseInt(item.Title);
  return Number.isInteger(result) ? result : item.id;
};

const mapItems = (items): CategoryListElement[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const { id, name, MetaTagDescription: image, children } = item;
      return {
        id,
        image,
        name,
        order: parseOrder(item),
        children: mapItems(children),
        showOnHome: false,
      };
    })
    .sort((a, b) => a.order - b.order);
};

const getItemsWithShowOnHomeSet = (items): CategoryListElement[] => {
  const toShowOnHome = items.filter((item) => item.showOnHome);

  let getShowingStrategy = (_item, index) => index < 3;

  if (items.length <= 5) {
    getShowingStrategy = () => true;
  } else if (toShowOnHome.length > 0) {
    getShowingStrategy = (item) =>
      toShowOnHome.some((itemToShow) => itemToShow.id === item.id);
  }

  return items.map((item, index) => ({
    ...item,
    showOnHome: getShowingStrategy(item, index),
  }));
};

export const categoryTree = async (
  fetchFn: () => Promise<{ data: Category[] }>
): Promise<CategoryListElement[]> => {
  try {
    const res = await fetchFn();

    if (!res.data) {
      return [];
    }

    const parsedItems = mapItems(res.data);

    return getItemsWithShowOnHomeSet(parsedItems);
  } catch (e) {
    console.error('Fetch failed');
    return [];
  }
};
