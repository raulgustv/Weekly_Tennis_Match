export const averageNTRP = (pair) => {
  if (!pair || pair.length < 2) return null;

  const ntrp1 = Number(pair[0].user?.ntrplvl);
  const ntrp2 = Number(pair[1].user?.ntrplvl);

  if (isNaN(ntrp1) || isNaN(ntrp2)) return null;

  return Number(((ntrp1 + ntrp2) / 2).toFixed(2));
};



export const createPairsSmart = (players) => {
    const pairs = [];
    const pool = [...players];

    while (pool.length >= 2) {
        let bestI = 0
        let bestJ = 1
        let minDiff = Math.abs(pool[0].ntrp - pool[1].ntrp);

        for (let i = 0; i < pool.length; i++) {
            for (let j = i + 1; j < pool.length; j++) {
                const diff = Math.abs(pool[i].ntrp - pool[j].ntrp)
                if (diff < minDiff) {
                    minDiff = diff;
                    bestI = i;
                    bestJ = j;
                }
            }
        }

        const pair = [pool[bestI], pool[bestJ]]

        pairs.push(pair)

        pool.splice(bestJ, 1)
        pool.splice(bestI, 1)

    }

    return pairs;
}

export const rotatePlayers = (players) => {
    if (players.length <= 2) return players;

    return [players[0], ...players.slice(2), players[1]];
}