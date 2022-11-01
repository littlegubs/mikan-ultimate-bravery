export type Marble = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type Bet = 't1' | 't2' | 't3' | 't4' | 'e'
export interface Command {
  amount: number
}

export interface BetCommand extends Command {
  type: Bet
  marbles: Marble[]
}

export interface JoinCommand extends Command {
  colour: number
  scale: number
  gravity: number
  bounciness: number
  airFriction: number
}

export function isBetCommand(command: BetCommand | JoinCommand): command is BetCommand {
  return !!Object.keys(command).find((key) => key === 'type')
}
