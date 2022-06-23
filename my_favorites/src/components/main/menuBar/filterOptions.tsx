import React, { useEffect, useState } from "react";

import produce from "immer";
import { FilterOptions } from "./filter";
import { useQuery } from "@apollo/client";
import { allFavoritesOnDB } from "../../../utils/dataBase/querys/favorites";

type Filters = {
	genre: string[];
	tags: string[];
	note: string[];
};

interface OptionsProps {
	filterOption: FilterOptions;
}

export const Options = ({ filterOption }: OptionsProps) => {
	const [filters, setFilters] = useState<Filters>({ genre: [], tags: [], note: [] });
	const { data } = useQuery(allFavoritesOnDB);

	const generateOptions = (option: string) => {
		const options = data.favorites
			.map((favorite) => favorite[option])
			.filter((option) => option != "")
			.flat();

		return options;
	};

	const giveClassToOptions = () => {
		const filterOptionsDiv = document.querySelector(".filter-options") as HTMLDivElement;
		const buttonsOptions = filterOptionsDiv.childNodes as NodeListOf<HTMLButtonElement>;
		const allFilters = [...filters.genre, ...filters.note, ...filters.tags];

		buttonsOptions.forEach((button) => {
			if (allFilters.includes(button.textContent)) button.classList.add("active");
		});
	};

	const giveClassToMenus = () => {
		const filterMenuDiv = document.querySelector(".filter-menu") as HTMLDivElement;
		const buttonsMenu = filterMenuDiv.childNodes as NodeListOf<HTMLButtonElement>;

		buttonsMenu.forEach((button) => {
			const hasActiveFilter = filters[button.name].length > 0 ? "active" : "";
			button.className = hasActiveFilter;
		});
	};

	useEffect(() => {
		giveClassToOptions();
		giveClassToMenus();
	});

	useEffect(() => {
		const favorites = document.querySelectorAll(".favorite") as NodeListOf<HTMLDivElement>;
		const activeFiltersTotal = filters.genre.length + filters.note.length + filters.tags.length;
		const allFilters = [...filters.genre, ...filters.note, ...filters.tags];
		const filterKeys = Object.keys(filters);

		if (activeFiltersTotal === 0) {
			favorites.forEach((favorite) => (favorite.style.display = "flex"));
			return;
		}

		favorites.forEach((favorite) => {
			filterKeys.forEach((key) => {
				const options = favorite.getAttribute(`data-${key}`).split(",");

				options.forEach((option) => {
					const hasFilter = allFilters.includes(option);

					if (hasFilter) favorite.style.display = "flex";
				});
			});
		});
	}, [filters]);

	const activeFilter = (e: React.SyntheticEvent) => {
		const favorites = document.querySelectorAll(".favorite") as NodeListOf<HTMLDivElement>;

		const target = e.target as HTMLButtonElement;
		const filterText = target.textContent;
		const filterName = target.name;

		favorites.forEach((favorite) => (favorite.style.display = "none"));
		target.classList.toggle("active");

		setFilters(
			produce(filters, (draft) => {
				const hasFilter = draft[filterName].indexOf(filterText);

				if (hasFilter > -1) {
					draft[filterName].splice(hasFilter, 1);
					return;
				}

				draft[filterName].push(filterText);
			})
		);
	};

	const options = {
		genre: generateOptions("genre"),
		tags: generateOptions("tags"),
		note: ["Incrivel", "Bom", "Normal", "Ruim", "Sem Nota"],
	};

	return (
		<div className="filter-options">
			{options[filterOption].map((option: string, index: number) => (
				<button key={option + index} name={filterOption} onClick={(e) => activeFilter(e)}>
					{option}
				</button>
			))}
		</div>
	);
};
