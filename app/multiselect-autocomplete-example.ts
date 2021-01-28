import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export class User {
  constructor(
    public firstname: string,
    public lastname: string,
    public selected?: boolean
  ) {
    if (selected === undefined) selected = false;
  }
}

export interface Commodity {
  commodityName: string;
  icon: string;
  selected?: boolean;
}

/**
 * @title Multi-select autocomplete
 */
@Component({
  selector: "multiselect-autocomplete-example",
  templateUrl: "multiselect-autocomplete-example.html",
  styleUrls: ["multiselect-autocomplete-example.css"]
})
export class MultiselectAutocompleteExample implements OnInit {
  commodityControl = new FormControl();

  commodities: Commodity[] = [
    { commodityName: "Gas", icon: "whatshot" },
    { commodityName: "Electric", icon: "flash_on" },
    { commodityName: "Water", icon: "opacity" }
  ];

  selectedCommodity: Commodity;
  selectedCommodityName: string;
  selectedIcon: string;

  filteredCommodities: Observable<Commodity[]>;
  lastFilter: string = "";

  ngOnInit() {
    this.filteredCommodities = this.commodityControl.valueChanges.pipe(
      startWith<string | User[]>(""),
      map(value => (typeof value === "string" ? value : this.lastFilter)),
      map(filter => this.filter(filter))
    );
  }

  filter(filter: string): Commodity[] {
    this.lastFilter = filter;
    if (filter) {
      return this.commodities.filter(option => {
        return (
          option.commodityName.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        );
      });
    } else {
      return this.commodities.slice();
    }
  }

  displayFn(value: Commodity[] | string): string | undefined {
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((commodity: Commodity, index) => {
        if (index === 0) {
          displayValue = commodity.commodityName;
        } else {
          displayValue += ", " + commodity.commodityName;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }

  optionClicked(event: Event, commodity: Commodity) {
    event.stopPropagation();
    this.toggleSelection(commodity);
  }

  toggleSelection(commodity: Commodity) {
    commodity.selected = !commodity.selected;
    if (commodity.selected) {
      this.selectedCommodity = commodity;
      this.selectedIcon = commodity.icon;
    }

    this.commodityControl.setValue(this.selectedCommodity.commodityName);
  }
}
