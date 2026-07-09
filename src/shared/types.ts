export type Day='Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday'|'Sunday';
export type MealSlot='breakfast'|'lunch'|'dinner';
export type Diet='none'|'vegetarian'|'vegan'|'halal'|'kosher'|'gluten_free'|'dairy_free'|'nut_free';
export interface Ingredient{ id:string; name:string; category:string; nutrition:{calories:number;protein:number;fat:number;carbs:number;fiber:number;sodium:number}; micronutrients:string[]; cost:number; unit:string; packageSizes:number[]; shelfLifeRaw:number; shelfLifeCooked:number; freezes:boolean; diets:string[]; storage:string; aisle:string; pantry:boolean; spice:boolean; image?:string; }
export interface TechniqueInput{ ingredientId:string; amount:number; unit:string; }
export interface Technique{ id:string; name:string; appliance:string; prepMinutes:number; cookMinutes:number; outputComponentId:string; yieldServings:number; storageLifeDays:number; inputs:TechniqueInput[]; instructions:string[]; image?:string; }
export interface Component{ id:string; name:string; techniqueId?:string; ingredientIds:string[]; storageLifeDays:number; servingSize:string; diets:string[]; image?:string; }
export interface MealTemplate{ id:string; name:string; slots:MealSlot[]; cuisine:string; components:string[]; diets:string[]; avoidAppliances?:string[]; calories:number; protein:number; image?:string; }
export interface UserPreferences{ selectedMeals:Record<Day,Record<MealSlot,boolean>>; cookingWindows:Record<Day,{morning:boolean;evening:boolean}>; appliances:string[]; diets:Diet[]; budget?:number; dailyCalories?:number; dailyProtein?:number; foodsToAvoid:string[]; preferredCuisines:string[]; maxSessionMinutes:number; }
export interface GroceryItem{ ingredient:Ingredient; packageSize:number; packages:number; needed:number; waste:number; totalCost:number; }
export interface PlannedMeal{ day:Day; slot:MealSlot; meal:MealTemplate; }
export interface CookingSession{ day:Day; window:'morning'|'evening'; techniques:Technique[]; mealsUsedBy:string[]; totalMinutes:number; }
export interface MealPlan{ meals:PlannedMeal[]; groceryList:GroceryItem[]; cookingSchedule:CookingSession[]; totalCost:number; costPerMeal:number; wasteScore:number; }
