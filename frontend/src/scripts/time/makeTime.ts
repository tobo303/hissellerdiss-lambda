/**
 * This module provides utility functions to convert time units into milliseconds.
 * 
 * Functions:
 * - makeHours(hours: number): Converts hours to milliseconds.
 * - makeMinutes(minutes: number): Converts minutes to milliseconds.
 * - makeSeconds(seconds: number): Converts seconds to milliseconds.
 */

/**
 * Converts hours to milliseconds.
 * @param hours The number of hours to convert.
 * @returns The number of milliseconds in the given number of hours.
 * @example
 * makeHours(1); // 3600000
*/
function makeHours(hours: number) : number {
    return hours * makeMinutes(60);
  }
  
  /**
   * Converts minutes to milliseconds.
   * @param minutes The number of minutes to convert.
   * @returns The number of milliseconds in the given number of minutes.
   * @example
   * makeMinutes(1); // 60000
  */
  function makeMinutes(minutes: number) : number {
    return minutes * makeSeconds(60);
  }
  
  /**
   * Converts seconds to milliseconds.
   * @param seconds The number of seconds to convert.
   * @returns The number of milliseconds in the given number of seconds.
   * @example
   * makeSeconds(1); // 1000
  */
  function makeSeconds(seconds: number) : number {
    return seconds * 1000;
  }
  
  export { makeHours, makeMinutes, makeSeconds };