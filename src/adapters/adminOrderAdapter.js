// 주문 화면 데이터 변환 자리.
function toMenuEditModel(response) {
  return {
    ...response,
    detail: {
      description: response.description,
      imageUrl: response.imageUrl,
      ingredients: response.ingredients,
      optionGroups: response.optionPolicies,
      nutrition: response.nutrition,
      allergens: response.allergens,
      tags: response.tags,
    },
  };
}
