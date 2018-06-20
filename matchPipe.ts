/**
 * Created by Rashmi.Maheshwari on 3/13/2018.
 */

import { Pipe } from '@angular/core';

@Pipe({
    name:"matchInput"
})

export class MatchInputPipe {
    transform(input:any[], matchWith:string, valueField:string) : any {
       if (input === undefined || matchWith === undefined || matchWith.trim().length === 0 || matchWith === ',')
           return input; // if nothing to filter on return original input

       return input.filter(item => item[valueField].toUpperCase().indexOf(matchWith.toUpperCase()) > -1);
    }
}