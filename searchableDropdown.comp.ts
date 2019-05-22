/**
 * Created by Rashmi.Maheshwari on 3/15/2018.
 */

import {Component,Input,Output,EventEmitter,SimpleChanges,OnChanges,HostListener,ElementRef} from '@angular/core';
import {htmlTemplate} from './searchableDropdown.comp.html';

class SearchDropDownConfig {
    title:string; //heading text
    defaultSelected:any; //by default selected item
    list: object[] = []; /// array that shows as ul-li list
    idField:string; //in array id column name. Required
    valueField:string; //in array value column name. Required
    reqd:any; //optional

    constructor(config: any = {}) {
        this.title = config.title || '';
        this.defaultSelected = config.defaultSelected || 'All';
        this.list = config.list || [];
        this.idField = config.idField || '';
        this.valueField = config.valueField || '';
        this.reqd = config.reqd || false;
    }
}

@Component({
    selector: 'search-drop-down',
    providers: [],
    template: htmlTemplate,
    styleUrls: ['app/lib/SearchableDropDown/searchableDropdown.css']
})
export class SearchableDropDownComponent implements OnChanges {
    @Input() searchDropDownConfig: any;
    config: SearchDropDownConfig;
    @Output() outDrop = new EventEmitter(); //send out picked value

    isOpen: boolean = false; //to open the dropdown
    idSelected: any; //highlight selected value in the list
    displaySelected: string; //display selected item display name
    matchWith: string = ''; //filter dropdown list ...starting with matchWith string
    tooltipText = "";
    selDropdownIndex:number; //track keydown and up number in the list
    displayList: object[] = []; //to show selected on top of list

    constructor(private eRef: ElementRef) {}

    ngOnChanges(changes: SimpleChanges) {
        this.config = new SearchDropDownConfig(this.searchDropDownConfig);
        let d = this.config.list.find(item => item[this.config.idField] === this.config.defaultSelected) || {};
        d['selected'] = true;
        this.displaySelected = this.config.title.concat(d[this.config.valueField]); //show default as title:default value
        this.idSelected = this.config.defaultSelected;
        this.tooltipText = this.displaySelected;
        this.selDropdownIndex = 0; //start of * default value
    }

    @HostListener('document:click', ['$event']) clickout(event) {
        this.toggleList(true);
    }

    handleInsideClicks(event) {
        if (event.target.className == 'caret' || event.target.className == 'input-group-addon clickable' || event.target.className =='form-control') {
            this.toggleList(this.isOpen);
            event.stopPropagation();
        }
        else if (event.target.className !== '') {
            this.toggleList(false);
            event.stopPropagation();
        }
    }

    /* to open/close the dropdown */
    private toggleList(isOpen) {
        this.isOpen = !isOpen;
        this.matchWith = ""; //if any filter remove it
        this.selectedItemOnTop();
    }

    /* bring selected item on top of the list */
    private selectedItemOnTop() {
        this.displayList = JSON.parse(JSON.stringify(this.config.list)); // deep copy list
        this.selDropdownIndex = 0;
    }

    /* if longer text, truncate and add ellipsis. if user selected default then show back as title:default value */
    setDisplaySelected() {
        if (this.displaySelected.length === 0 || this.displaySelected === '*' || this.displaySelected.toUpperCase() === this.config.defaultSelected.toUpperCase()) {
            this.displaySelected = this.config.title.concat(this.config.defaultSelected);
            return this.tooltipText = this.displaySelected;
        }  // return default title

        //tooltip text has config title plus original user selected value with no truncation
        this.tooltipText = (this.config.title) ? this.config.title.concat(this.displaySelected) : this.displaySelected;
    }

    //filter values if present anywhere in the string
    filterValues() {
       return this.config.list.filter(item => item[this.config.idField].toUpperCase().indexOf(this.matchWith.toUpperCase()) > -1);
    }

    //if one value left on match then auto select it
    onMatchWithChange(){
        let v = this.filterValues();
        if (v.length === 1) this.selectValue(v[0][this.config.idField]);
    }

    //track key up and down to update index
    onKeyDown(evt) {
        if (evt.keyCode === 40 && this.selDropdownIndex < this.config.list.length - 1) {
            this.selDropdownIndex ++; /// arrow down key is pressed
        } else if (evt.keyCode === 38 && this.selDropdownIndex > 0) {
            this.selDropdownIndex --; /// arrow up key is pressed
        } else if (evt.keyCode === 13) {
            //get filtered list starting index first..add seldropindex
            let v = this.filterValues();
            this.selectValue(v[this.selDropdownIndex][this.config.idField]); /// enter key is pressed
        }
    }

    //click action on li
    toggleSelect(value) {
        if(this.idSelected === value) this.unselectValue();
        else this.selectValue(value);
    }

    /* select and emit the output */
    selectValue(value) {
        this.displaySelected = ""; //reset
        let sel = this.config.list.find(d => d[this.config.idField] === value); //find the selected value
        sel['selected'] = !sel['selected']; //set as selected
        let arr = this.config.list.filter(d => (d['selected'])) || []; //find all selected
        if (arr.length > 1) {
            arr = arr.filter(d => d[this.config.idField] !== this.config.defaultSelected); //remove default from selected list
            let unselectDefault = this.config.list.find(d => d[this.config.idField] === this.config.defaultSelected);
            unselectDefault['selected'] = false;
        }
        this.idSelected = ''; //is not default so that selected color shows on input box
        this.displaySelected = arr.map(e => e[this.config.valueField]).join("; "); //join them with space as display name has comma in it
        this.setDisplaySelected();
        this.selectedItemOnTop();
        this.matchWith = ""; //reset match character
        this.outDrop.emit(arr.map(e => e[this.config.idField]).join(";")); //emit output. comma separated userids
    }

    /* Clear search input within dropdown and user selection */
    clearFilter() {
        this.matchWith = ""; //reset
        this.idSelected = this.config.defaultSelected; //back to default
        this.displaySelected= ""; //reset
        this.config.list.map(d => d['selected'] = (d[this.config.idField] == this.idSelected)); //reset list
        this.setDisplaySelected();
        this.selectedItemOnTop();
        this.outDrop.emit(this.idSelected); //emit output
    }

    /* unselect the checked value */
    unselectValue() {
        this.idSelected = this.config.defaultSelected; //back to default
        this.displaySelected= ""; //reset
        this.setDisplaySelected();
        this.selectedItemOnTop();
        this.outDrop.emit(this.idSelected); //emit output
    }
}