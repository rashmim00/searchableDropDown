/**
 * Created by Rashmi.Maheshwari on 3/15/2018.
 */
export const htmlTemplate = `
    <div class="input-group" [ngClass]="{'tooltip1':!isOpen}">   
       <input class="form-control" [ngClass]="{'selected':!config.reqd && idSelected !== config.defaultSelected,
       'showReqd':config.reqd && idSelected === config.defaultSelected,'validReqd':config.reqd && idSelected !== config.defaultSelected}"
        value="{{displaySelected}}" size="15" readonly>            
      
       <span *ngIf="!isOpen" class="tooltiptext">{{tooltipText}}</span>
       <span class="input-group-addon clickable"><span class="caret"></span></span>
       
       <ul *ngIf="isOpen" class="dropdown-menu show-menu">  
          <div class="addPadding text-muted">  
            <input type="text" #searchbox name="searchbox" id="searchbox" class="form-control" [(ngModel)]="matchWith" (ngModelChange)="onMatchWithChange()" (keydown)="onKeyDown($event)" placeholder="Search here" size="14">
            <span class="glyphicon glyphicon-search form-control-feedback"></span>
                 
            <button class="btn btn-link" (click)="clearFilter()">Clear selected item</button>
            <li class="divider"></li>
          </div>
          <li *ngFor="let l of displayList | matchInput:matchWith:config.valueField; let i = index;" class="text-muted" 
              (click)="toggleSelect(l[config.idField])" [ngClass]="{'selected':l[config.idField] === idSelected, 'active': i === selDropdownIndex}">
             <span *ngIf="l[config.idField] !== idSelected" class="glyphicon glyphicon-unchecked addPadding"></span>
             <span *ngIf="l[config.idField] === idSelected" class="glyphicon glyphicon-check addPadding"></span>
             <span class="addPadding">{{l[config.valueField]}}</span>
          </li>        
      </ul>      
    </div>   
    `;