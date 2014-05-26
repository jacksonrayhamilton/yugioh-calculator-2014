When you click the terminal button, you enter expression mode.

You have an array of operands and operators.
You have an index in this array.
Each operand also has its own cursor index.

Whenever you enter numbers you overwrite like normal on the current operand.
Whenever you enter an operator
- That operator is appended to the array.
- A new operand is appended to the array, your index in the array bounces to this.

Whenever you clear, the expression array is emptied.

Whenever you backspace, you erase back a 0 like normal if possible.
However, if the previous index is less than 0, AND the array index > 0,
- Delete the current operand.
- Delete the operator behind the current operand.
- Bounce to the previous operand.

When you click the terminal button again, you evaluate the expression.
You reduce the array by accumulating strings into a new array.
Whenever the new array has a size of 3
- Parse the 0th and 2th operands.
- Apply the 1th operator to them.
- Make the result into a string.
- The return array is now an array of length 1.
After the reduction is complete, result[0] becomes the value of "the operand."
The cursor is placed at the first non-leading zero.
