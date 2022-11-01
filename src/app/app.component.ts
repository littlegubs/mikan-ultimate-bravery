import { Component, OnInit } from '@angular/core'
import { Bet, BetCommand, isBetCommand, JoinCommand, Marble } from './shared/interfaces/marble.interface'
import { FormControl, FormGroup } from '@angular/forms'

const MARBLES: Marble[] = [0, 1, 2, 3, 4, 5, 6, 7]

const betTypeMarbleNumber: { [k in Bet]: number[][] } = {
  t1: [[1, 1]],
  t2: [
    [50, 2],
    [1, 1],
  ],
  t3: [
    [110, 3],
    [30, 2],
    [1, 1],
  ],
  t4: [
    [150, 4],
    [90, 3],
    [10, 2],
    [1, 1],
  ],
  e: [
    [170, 4],
    [130, 3],
    [70, 2],
  ],
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  command?: BetCommand | JoinCommand
  formGroup = new FormGroup({
    level: new FormControl<number>(1, { nonNullable: true }),
    points: new FormControl<number>(1600, { nonNullable: true }),
    betTypes: new FormGroup({
      t1: new FormControl(true, { nonNullable: true }),
      t2: new FormControl(true, { nonNullable: true }),
      t3: new FormControl(true, { nonNullable: true }),
      t4: new FormControl(true, { nonNullable: true }),
      e: new FormControl(false, { nonNullable: true }),
      join: new FormControl(false, { nonNullable: true }),
    }),
  })

  ngOnInit(): void {}

  roll(): void {
    const selectedBets = Object.keys(this.formGroup.controls.betTypes.controls).filter(
      (key) => this.formGroup.controls.betTypes.controls[key as Bet | 'join'].value
    )
    const bet = selectedBets[Math.floor(Math.random() * selectedBets.length)] as Bet | 'join'
    let command: BetCommand | JoinCommand
    if (bet === 'join') {
      command = {
        colour: Math.floor(Math.random() * 25),
        scale: Math.random(),
        gravity: Math.random(),
        bounciness: Math.random(),
        airFriction: Math.random(),
        amount: 0,
      }
    } else {
      command = {
        type: bet,
        marbles: this.drawMarbles(bet),
        amount: 0,
      }
    }
    this.command = { ...command, amount: Math.random() * (this.formGroup.controls.points.value - 50) + 50 }
  }

  drawMarbles(bet: Bet): Marble[] {
    const mininumMarbles = bet === 'e' ? 2 : 1
    let marbles: Marble[] = []
    const maxMarblesNumber =
      betTypeMarbleNumber[bet].find((sex) => sex[0] <= this.formGroup.controls.level.value)?.[1] ?? 1
    console.log()
    const marblesNumber = Math.floor(Math.random() * (maxMarblesNumber - mininumMarbles + 1) + mininumMarbles)
    for (let i = 0; i < marblesNumber; i++) {
      const remainingMarbles = MARBLES.filter((marble) => !marbles.includes(marble))
      marbles = [...marbles, remainingMarbles[Math.floor(Math.random() * remainingMarbles.length)]]
    }

    return marbles
  }

  commandToString(command: BetCommand | JoinCommand): string {
    if (isBetCommand(command)) {
      return `!bet ${command.type} ${command.marbles.join('')} ${Math.round(command.amount)}`
    }

    return `!join ${command.colour} ${command.scale.toFixed(2)} ${command.gravity.toFixed(2)}
    ${command.bounciness.toFixed(2)} ${command.airFriction.toFixed(2)} ${Math.round(command.amount)}`
  }
}
