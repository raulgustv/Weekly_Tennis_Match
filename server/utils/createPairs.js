export const averageNTRP = (pair) => {
  if (!pair || pair.length < 2) return null;

  const ntrp1 = Number(pair[0].user?.ntrplvl);
  const ntrp2 = Number(pair[1].user?.ntrplvl);

  if (isNaN(ntrp1) || isNaN(ntrp2)) return null;

  return Number(((ntrp1 + ntrp2) / 2).toFixed(2));
};



// export const createPairsSmart = (players) => {
//     const pairs = [];
//     const pool = [...players];

//     while (pool.length >= 2) {
//         let bestI = 0
//         let bestJ = 1
//         let minDiff = Math.abs(pool[0].ntrp - pool[1].ntrp);

//         for (let i = 0; i < pool.length; i++) {
//             for (let j = i + 1; j < pool.length; j++) {
//                 const diff = Math.abs(pool[i].ntrp - pool[j].ntrp)
//                 if (diff < minDiff) {
//                     minDiff = diff;
//                     bestI = i;
//                     bestJ = j;
//                 }
//             }
//         }

//         const pair = [pool[bestI], pool[bestJ]]

//         pairs.push(pair)

//         pool.splice(bestJ, 1)
//         pool.splice(bestI, 1)

//     }

//     return pairs;
// }

export const createPairsSmart = (players) => {
    const pairs = [];
    const pool = [...players];

    const isCompatible = (a, b) => {
        const diff = Math.abs(a.user.ntrplvl - b.user.ntrplvl);

        // regla fuerte: evitar saltos grandes
        if (diff <= 0.5) return true;
        if (diff === 1) {
            // permitir solo si ambos están en el mismo bloque competitivo
            const min = Math.min(a.user.ntrplvl, b.user.ntrplvl);
            const max = Math.max(a.user.ntrplvl, b.user.ntrplvl);

            // 2-3 permitido
            if (min === 2 && max === 3) return true;

            // 3-3.5 permitido
            if (min === 3 && max === 3.5) return true;

            // 3.5-4 permitido
            if (min === 3.5 && max === 4) return true;
        }

        return false;
    };

    while (pool.length >= 2) {

        let bestI = -1;
        let bestJ = -1;
        let minDiff = Infinity;

        for (let i = 0; i < pool.length; i++) {
            for (let j = i + 1; j < pool.length; j++) {

                if (!isCompatible(pool[i], pool[j])) continue;

                const diff = Math.abs(
                    pool[i].user.ntrplvl - pool[j].user.ntrplvl
                );

                if (diff < minDiff) {
                    minDiff = diff;
                    bestI = i;
                    bestJ = j;
                }
            }
        }

        // si no encontró compatibles, relajamos regla
        if (bestI === -1) {
            bestI = 0;
            bestJ = 1;
        }

        const pair = [pool[bestI], pool[bestJ]];
        pairs.push(pair);

        pool.splice(bestJ, 1);
        pool.splice(bestI, 1);
    }

    return pairs;
};

export const rotatePlayers = (players) => {
    if (players.length <= 2) return players;

    return [players[0], ...players.slice(2), players[1]];
}