import { Day, MealSlot, UserPreferences } from './types';
export const days:Day[]=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export const slots:MealSlot[]=['breakfast','lunch','dinner'];
export function defaultPreferences():UserPreferences{ const selectedMeals={} as UserPreferences['selectedMeals']; const cookingWindows={} as UserPreferences['cookingWindows']; for(const d of days){ selectedMeals[d]={breakfast:true,lunch:true,dinner:true}; cookingWindows[d]={morning:false,evening:d==='Sunday'||d==='Wednesday'};} return {selectedMeals,cookingWindows,appliances:['Oven','Rice Cooker','Microwave','Air Fryer'],diets:['none'],foodsToAvoid:[],preferredCuisines:[],maxSessionMinutes:120};}
