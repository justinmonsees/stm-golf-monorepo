export function convertToLocalDate(date) {
  const utcDate = new Date(date);

  const localDate = new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
  );

  return localDate;
}

export function generateRandomPassword() {
  return Math.random().toString(36).slice(2);
}

export function rearrangeHoles(fromHoleNum, toHoleNum, teeGroupArray) {
  // Create a deep copy to ensure immutability
  let updatedTeeGroups = JSON.parse(JSON.stringify(teeGroupArray));

  const isMovingForward = toHoleNum > fromHoleNum;

  // Step 1: Identify groups that are moving
  const groupsToMove = updatedTeeGroups.filter(
    (group) => group.hole_number === fromHoleNum
  );

  // Step 2: Update the hole_number for the groups being moved
  groupsToMove.forEach((group) => {
    group.hole_number = toHoleNum;
  });

  // Step 3: Adjust hole_numbers for other affected groups
  updatedTeeGroups.forEach((group) => {
    // Skip the groups we just moved
    if (
      group.golf_tee_group_id &&
      groupsToMove.some((g) => g.golf_tee_group_id === group.golf_tee_group_id)
    ) {
      return;
    }

    if (isMovingForward) {
      // If moving from 1 to 3:
      // Groups originally between 1 (inclusive) and 3 (exclusive) need to shift down by 1.
      // So, if moveFrom=1, moveTo=3, groups at original hole 1 and 2 shift down.
      if (group.hole_number > fromHoleNum && group.hole_number <= toHoleNum) {
        group.hole_number--;
      }
    } else {
      // Moving backward (e.g., from 3 to 1)
      // If moving from 3 to 1:
      // Groups originally between 1 (inclusive) and 3 (exclusive) need to shift up by 1.
      // So, if moveFrom=3, moveTo=1, groups at original hole 1 and 2 shift up.
      if (group.hole_number >= toHoleNum && group.hole_number < fromHoleNum) {
        group.hole_number++;
      }
    }
  });

  // Step 4: Re-sort the array by hole_number and then hole_letter
  updatedTeeGroups.sort((a, b) => {
    if (a.hole_number !== b.hole_number) {
      return a.hole_number - b.hole_number;
    }
    return a.hole_letter.localeCompare(b.hole_letter);
  });

  return updatedTeeGroups;
}
