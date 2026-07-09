import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, ChefHat, Clock, Settings2, ShoppingBasket, Utensils } from 'lucide-react';
import './style.css';
import { defaultPreferences, days, slots } from '../shared/defaultPreferences';
import { optimizeMealPlan } from '../shared/optimizer';
import { Day, MealSlot, UserPreferences } from '../shared/types';

const appliances = ['Oven', 'Air Fryer', 'Rice Cooker', 'Pressure Cooker', 'Slow Cooker', 'Microwave', 'Grill'];
const diets = ['none', 'vegetarian', 'vegan', 'halal', 'kosher', 'gluten_free', 'dairy_free', 'nut_free'] as const;
const slotLabels: Record<MealSlot, string> = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };

function App() {
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences());
  const [generated, setGenerated] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const plan = useMemo(() => optimizeMealPlan(prefs), [prefs]);
  const selectedCount = days.reduce((total, day) => total + slots.filter(slot => prefs.selectedMeals[day][slot]).length, 0);
  const windowCount = days.reduce((total, day) => total + (prefs.cookingWindows[day].morning ? 1 : 0) + (prefs.cookingWindows[day].evening ? 1 : 0), 0);

  const update = (next: Partial<UserPreferences>) => {
    setGenerated(false);
    setPrefs({ ...prefs, ...next });
  };

  const setMeal = (day: Day, slot: MealSlot, checked: boolean) => {
    setGenerated(false);
    setPrefs({ ...prefs, selectedMeals: { ...prefs.selectedMeals, [day]: { ...prefs.selectedMeals[day], [slot]: checked } } });
  };

  const setWindow = (day: Day, window: 'morning' | 'evening', checked: boolean) => {
    setGenerated(false);
    setPrefs({ ...prefs, cookingWindows: { ...prefs.cookingWindows, [day]: { ...prefs.cookingWindows[day], [window]: checked } } });
  };

  const generate = () => {
    setGenerated(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return <main>
    <section className="bg-gradient-to-br from-sage to-emerald-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="pill inline-block bg-white/20 text-white">All-in-one planning page</p>
        <h1 className="mt-4 text-5xl font-black">Meal Prep Optimizer</h1>
        <p className="mt-4 max-w-3xl text-lg text-emerald-50">Choose dietary restrictions, meals by day, appliances, and cooking windows in one place. Generate a plan to jump straight to your recipe cards, weekly calendar, grocery list, and batch cooking schedule.</p>
      </div>
    </section>

    <div className="mx-auto max-w-7xl px-6 py-8">
      <section className="card">
        <div className="flex flex-col gap-4 border-b border-orange-100 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="pill inline-flex items-center gap-2"><Settings2 size={16} /> Planner setup</p>
            <h2 className="mt-3 text-3xl font-black">Tell us what to plan</h2>
            <p className="mt-2 text-slate-600">Selected meals: <b>{selectedCount}</b> · Cooking windows: <b>{windowCount}</b> · Appliances: <b>{prefs.appliances.length}</b></p>
          </div>
          <button className="btn text-lg disabled:cursor-not-allowed disabled:opacity-50" disabled={!selectedCount} onClick={generate}>Generate recipe cards & calendar</button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-3xl bg-cream p-5">
              <label className="block text-sm font-bold">Dietary restriction</label>
              <select className="mt-2 w-full rounded-xl border p-2" value={prefs.diet} onChange={e => update({ diet: e.target.value as UserPreferences['diet'] })}>
                {diets.map(d => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
              </select>
              <label className="mt-4 block text-sm font-bold">Foods to avoid</label>
              <input className="mt-2 w-full rounded-xl border p-2" placeholder="mushrooms, pork" value={prefs.foodsToAvoid.join(', ')} onChange={e => update({ foodsToAvoid: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })} />
              <label className="mt-4 block text-sm font-bold">Max cooking session: {prefs.maxSessionMinutes} min</label>
              <input className="w-full accent-tomato" type="range" min="30" max="180" value={prefs.maxSessionMinutes} onChange={e => update({ maxSessionMinutes: +e.target.value })} />
            </div>

            <div className="rounded-3xl bg-cream p-5">
              <h3 className="font-black">Appliances available</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {appliances.map(a => <label className="flex gap-2 rounded-2xl bg-white p-3" key={a}>
                  <input type="checkbox" checked={prefs.appliances.includes(a)} onChange={e => update({ appliances: e.target.checked ? [...prefs.appliances, a] : prefs.appliances.filter(x => x !== a) })} />
                  {a}
                </label>)}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <Panel icon={<Utensils />} title="Meals to include">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left">
                  <thead><tr><th>Day</th>{slots.map(slot => <th key={slot}>{slotLabels[slot]}</th>)}</tr></thead>
                  <tbody>{days.map(day => <tr className="border-t" key={day}>
                    <td className="py-3 font-bold">{day}</td>
                    {slots.map(slot => <td key={slot}><label className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-2"><input type="checkbox" checked={prefs.selectedMeals[day][slot]} onChange={e => setMeal(day, slot, e.target.checked)} /> Plan</label></td>)}
                  </tr>)}</tbody>
                </table>
              </div>
            </Panel>

            <Panel icon={<Clock />} title="Cooking windows">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {days.map(d => <div className="rounded-2xl bg-cream p-4" key={d}>
                  <h4 className="font-black">{d}</h4>
                  {(['morning', 'evening'] as const).map(w => <label key={w} className="mt-3 flex gap-2 capitalize"><input type="checkbox" checked={prefs.cookingWindows[d][w]} onChange={e => setWindow(d, w, e.target.checked)} />{w}</label>)}
                </div>)}
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {generated ? <Results plan={plan} resultsRef={resultsRef} /> : <div className="mt-6 rounded-3xl border-2 border-dashed border-orange-200 bg-white/70 p-8 text-center">
        <h2 className="text-2xl font-black">Ready when you are</h2>
        <p className="mt-2 text-slate-600">Complete the setup above, then generate to view your recipe cards and weekly calendar.</p>
      </div>}
    </div>
  </main>;
}

function Results({ plan, resultsRef }: { plan: ReturnType<typeof optimizeMealPlan>; resultsRef: React.RefObject<HTMLDivElement> }) {
  return <div ref={resultsRef} className="mt-8 space-y-6">
    <div className="grid gap-4 md:grid-cols-4"><Metric title="Meals" value={plan.meals.length} /><Metric title="Total cost" value={`$${plan.totalCost.toFixed(2)}`} /><Metric title="Cost / meal" value={`$${plan.costPerMeal.toFixed(2)}`} /><Metric title="Waste score" value={plan.wasteScore.toFixed(1)} /></div>
    <Panel icon={<CalendarDays />} title="Weekly meal calendar"><div className="grid gap-3 md:grid-cols-7">{days.map(day => <div className="rounded-2xl bg-cream p-3" key={day}><h4 className="font-black">{day}</h4>{slots.map(slot => { const m = plan.meals.find(x => x.day === day && x.slot === slot); return <p className="mt-2 text-sm" key={slot}><b className="capitalize">{slot}:</b><br />{m?.meal.name || '—'}</p>; })}</div>)}</div></Panel>
    <Panel icon={<Clock />} title="Cooking schedule & recipe cards"><div className="grid gap-4 md:grid-cols-2">{plan.cookingSchedule.map((s, i) => <div className="card border-2 border-dashed border-orange-200" key={i}><p className="pill">{s.day} {s.window}</p><h3 className="mt-3 text-2xl font-black">Batch Prep Session</h3><p>{s.totalMinutes} minutes</p>{s.techniques.map(t => <div className="mt-4 rounded-2xl bg-cream p-4" key={t.id}><h4 className="font-black"><ChefHat className="inline" /> {t.name}</h4><p className="text-sm">Prep {t.prepMinutes} min · Cook {t.cookMinutes} min · {t.yieldServings} servings</p><ul className="mt-2 list-disc pl-5 text-sm">{t.instructions.map(step => <li key={step}>{step}</li>)}</ul><p className="mt-2 text-sm"><b>Storage:</b> refrigerate up to {t.storageLifeDays} days.</p></div>)}<p className="mt-3 text-sm"><b>Used in:</b> {s.mealsUsedBy.join(', ')}</p></div>)}</div></Panel>
    <Panel icon={<ShoppingBasket />} title="Grocery list"><table className="w-full text-left"><thead><tr><th>Ingredient</th><th>Package</th><th>Qty</th><th>Waste</th><th>Cost</th></tr></thead><tbody>{plan.groceryList.map(g => <tr className="border-t" key={g.ingredient.id}><td>{g.ingredient.name}</td><td>{g.packageSize} {g.ingredient.unit}</td><td>{g.packages}</td><td>{g.waste.toFixed(1)}</td><td>${g.totalCost.toFixed(2)}</td></tr>)}</tbody></table></Panel>
  </div>;
}

function Metric(p: { title: string; value: string | number }) { return <div className="card"><p className="text-sm text-slate-500">{p.title}</p><p className="text-3xl font-black">{p.value}</p></div>; }
function Panel(p: { title: string; icon: React.ReactNode; children: React.ReactNode }) { return <section className="card"><h2 className="mb-4 flex items-center gap-2 text-2xl font-black">{p.icon}{p.title}</h2>{p.children}</section>; }
createRoot(document.getElementById('root')!).render(<App />);
