# searchableDropDown
Angular component for a searchable multi-select dropdown.
This component can be used to show an array as a searchable dropdown. It has an input box for the user to put in match characters and
a checkbox next to the list item to be selected and the selected items will show on top as a label with x to unselect the item. 

Add an image demo here. 

The @input is a config object which configures the list and its default selected value.
for example: an array of employees object which has employeeID as idField and name as valueField.
let empConfig = {                   
                    'defaultSelected':'All',
                    'list': ['All','FirstName LastName','AA AAAAAA', 'BBB BBBBB']                    
                };
@output is the comma separated selected values.

Usage
<search-drop-down [searchDropDownConfig]="empConfig" (outDrop)="selectEmployee($event)"></search-drop-down>

