Every time you click a button that affects your life points, an undo item is
saved.

The item is pushed onto a stack.

Whenever you undo, you pop the stack. If you pop `undefined` then stop.
The popped item is analyzed.

- If it is a life point plus/minus delta, subtract the value from the targeted player.

    {
        "type": "lifePointsDelta",
        "player": "player-0",
        "delta": -1000
    }

- If it is a game reset, set the life points of each player to their previous values.

    {
        "type": "lifePointsReset",
        "lifePoints": [
            {
                "player": "player-0",
                "lifePoints": 2400
            },
            {
                "player": "player-1",
                "lifePoints": 5000
            }
        ]
    }

- If it is a timer reset, set the start time back to it's previous time.

    {
        "type": "timerRestart",
        "startTime": 77777
    }

The undo stack is persistent.
