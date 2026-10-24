/* ============ missions.js — plantillas de misiones diarias y semanales ============
 * Cada día salen 3 diarias y cada semana 2 semanales (hora de España), con
 * objetivos y tipos sorteados. Se completan jugando y el premio se recoge en
 * la pantalla de Misiones. La lógica está en systems/progress.js.
 *
 *   ev      evento que la hace avanzar (ver G.Progress.event)
 *   match   (datos, parámetro) -> ¿cuenta este evento?
 *   value   datos -> cuánto vale; con mode 'max' se queda el mayor, con
 *           'add' (por defecto) se suma (1 si no hay value)
 *   param   'type': sortea un tipo Pokémon para la misión
 */
G.MissionDefs = (() => {
  const T = t => G.U.TYPE_NAME[t];
  const min = d => Math.floor(d.time / 60);

  // Nhiệm vụ 6 giờ (mốc cơ bản): lặp mỗi 6h, phần thưởng 2-3 vé thường, 150-250 xu
  const periodic6h = [
    { id: 'h6_kill', ev: 'kill', goals: [200, 300, 400], reward: { t1: 2, coins: 150 },
      text: n => `Derrota a ${n} Pokémon` },
    { id: 'h6_killType', ev: 'kill', param: 'type', goals: [20, 30, 40], reward: { t1: 2, coins: 200 },
      match: (d, t) => d.types.includes(t), text: (n, t) => `Derrota a ${n} Pokémon de tipo ${T(t)}` },
    { id: 'h6_survive', ev: 'runEnd', mode: 'max', value: min, goals: [5, 7], reward: { t1: 3, coins: 200 },
      text: n => `Aguanta ${n} minutos en una run` },
    { id: 'h6_level', ev: 'runEnd', mode: 'max', value: d => d.level, goals: [8, 10, 12], reward: { t1: 2, coins: 200 },
      text: n => `Llega al nivel ${n} en una run` },
    { id: 'h6_boss', ev: 'kill', match: d => d.boss, goals: [1], reward: { t1: 3, coins: 250 },
      text: n => (n === 1 ? 'Derrota a un jefe' : `Derrota a ${n} jefes`) },
    { id: 'h6_chest', ev: 'chest', goals: [1], reward: { t1: 2, coins: 200 },
      text: n => (n === 1 ? 'Abre un cofre con candado' : `Abre ${n} cofres con candado`) },
    { id: 'h6_coins', ev: 'runEnd', value: d => d.coins, goals: [150, 200, 300], reward: { t1: 2, coins: 150 },
      text: n => `Recoge ${n} monedas en tus runs` },
    { id: 'h6_playType', ev: 'runEnd', param: 'type', mode: 'max', value: min, goals: [3], reward: { t1: 3, coins: 200 },
      match: (d, t) => d.types.includes(t), text: (n, t) => `Aguanta ${n} minutos con un Pokémon de tipo ${T(t)}` },
    { id: 'h6_item', ev: 'item', goals: [1], reward: { t1: 2, coins: 150 },
      text: () => 'Encuentra un objeto equipable' },
    { id: 'h6_evolve', ev: 'evolve', goals: [1], reward: { t1: 3, coins: 250 },
      text: () => 'Evoluciona un movimiento' }
  ];

  // Nhiệm vụ hàng ngày: Thưởng x2 so với 6h (4-6 vé, 300-500 xu), độ khó x4 so với 6h
  const daily = [
    { id: 'd_kill', ev: 'kill', goals: [1000, 1500, 2000], reward: { t1: 4, coins: 300 },
      text: n => `Derrota a ${n} Pokémon` },
    { id: 'd_killType', ev: 'kill', param: 'type', goals: [80, 120, 160], reward: { t1: 4, coins: 400 },
      match: (d, t) => d.types.includes(t), text: (n, t) => `Derrota a ${n} Pokémon de tipo ${T(t)}` },
    { id: 'd_survive', ev: 'runEnd', mode: 'max', value: min, goals: [12, 15, 18], reward: { t1: 6, coins: 400 },
      text: n => `Aguanta ${n} minutos en una run` },
    { id: 'd_level', ev: 'runEnd', mode: 'max', value: d => d.level, goals: [30, 35, 40], reward: { t1: 4, coins: 400 },
      text: n => `Llega al nivel ${n} en una run` },
    { id: 'd_boss', ev: 'kill', match: d => d.boss, goals: [4, 6], reward: { t1: 6, coins: 500 },
      text: n => `Derrota a ${n} jefes` },
    { id: 'd_chest', ev: 'chest', goals: [4, 6], reward: { t1: 4, coins: 400 },
      text: n => `Abre ${n} cofres con candado` },
    { id: 'd_coins', ev: 'runEnd', value: d => d.coins, goals: [800, 1000, 1200], reward: { t1: 4, coins: 300 },
      text: n => `Recoge ${n} monedas en tus runs` },
    { id: 'd_playType', ev: 'runEnd', param: 'type', mode: 'max', value: min, goals: [10, 12], reward: { t1: 6, coins: 400 },
      match: (d, t) => d.types.includes(t), text: (n, t) => `Aguanta ${n} minutos con un Pokémon de tipo ${T(t)}` },
    { id: 'd_item', ev: 'item', goals: [4], reward: { t1: 4, coins: 300 },
      text: n => (n === 1 ? 'Encuentra un objeto equipable' : `Encuentra ${n} objetos equipables`) },
    { id: 'd_evolve', ev: 'evolve', goals: [3, 4], reward: { t1: 6, coins: 500 },
      text: n => `Evoluciona ${n} movimientos` }
  ];

  // Nhiệm vụ hàng tuần: Thưởng x3 hiện tại (3 vé x10 + 2400-3000 xu), độ khó x7 nhiệm vụ hàng ngày
  const weekly = [
    { id: 'wkill', ev: 'kill', goals: [10000, 14000], reward: { t10: 3, coins: 2400 },
      text: n => `Derrota a ${n.toLocaleString('es')} Pokémon` },
    { id: 'wrift', ev: 'rift', goals: [7, 10], reward: { t10: 3, coins: 3000 },
      text: n => (n === 1 ? 'Gana una pelea en una grieta' : `Gana ${n} peleas en grietas`) },
    { id: 'wboss', ev: 'kill', match: d => d.boss, goals: [28, 40], reward: { t10: 3, coins: 2700 },
      text: n => `Derrota a ${n} jefes` },
    { id: 'wsurvive', ev: 'runEnd', mode: 'max', value: min, goals: [20, 25], reward: { t10: 3, coins: 3000 },
      text: n => `Aguanta ${n} minutos en una run` },
    { id: 'wevolve', ev: 'evolve', goals: [20, 25], reward: { t10: 3, coins: 2700 },
      text: n => `Evoluciona ${n} movimientos` },
    { id: 'wdaily', ev: 'missionDone', match: d => d.daily, goals: [20, 25], reward: { t10: 3, coins: 2400 },
      text: n => `Completa ${n} misiones diarias` },
    { id: 'wcoins', ev: 'runEnd', value: d => d.coins, goals: [7000, 10000], reward: { t10: 3, coins: 2500 },
      text: n => `Recoge ${n.toLocaleString('es')} monedas en tus runs` },
    { id: 'wchest', ev: 'chest', goals: [25, 35], reward: { t10: 3, coins: 2700 },
      text: n => `Abre ${n} cofres con candado` }
  ];

  const BY = {};
  for (const m of periodic6h.concat(daily, weekly)) BY[m.id] = m;
  const legacy = {
    kill: periodic6h[0], killType: periodic6h[1], survive: periodic6h[2],
    level: periodic6h[3], boss: periodic6h[4], chest: periodic6h[5],
    coins: periodic6h[6], playType: periodic6h[7], item: periodic6h[8], evolve: periodic6h[9]
  };
  for (const [k, v] of Object.entries(legacy)) {
    if (!BY[k]) BY[k] = v;
  }

  return { periodic6h, daily, weekly, BY };
})();
