import React, { useState, useEffect } from "react";
import "../components/CharacterList.css";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../graphql/queries";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";

const readableStatus = (status: string) => {
  const map: Record<string, string> = {
    Alive: "Alive",
    Dead: "Dead",
    unknown: "Unknown",
  };
  return map[status] || status;
};

const CharacterList: React.FC = () => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [speciesFilter, setSpeciesFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [allCharacters, setAllCharacters] = useState<any[]>([]);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const { ref, inView } = useInView({
    threshold: 1,
  });

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    GET_CHARACTERS,
    {
      variables: {
        page: 1,
        filter: {
          status: statusFilter || undefined,
          species: speciesFilter || undefined,
        },
      },
    }
  );

  useEffect(() => {
    if (!loading && page === 1) {
      const timeout = setTimeout(() => {
        setShowContent(true);
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [loading, page]);

  useEffect(() => {
    if (filtersChanged) {
      refetch();
      setFiltersChanged(false);
    }
  }, [statusFilter, speciesFilter, filtersChanged]);

  useEffect(() => {
    if (data?.characters?.results) {
      setAllCharacters((prev) =>
        page === 1
          ? data.characters.results
          : [...prev, ...data.characters.results]
      );
    }
  }, [data, page]);

  useEffect(() => {
    if (inView && data?.characters?.info?.next) {
      setFetchingMore(true);
      fetchMore({
        variables: { page: data.characters.info.next },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            setTimeout(() => setFetchingMore(false), 500);
            return prevResult;
          }
          setTimeout(() => setFetchingMore(false), 500);

          return {
            characters: {
              __typename: prevResult.characters.__typename,
              info: fetchMoreResult.characters.info,
              results: [
                ...prevResult.characters.results,
                ...fetchMoreResult.characters.results,
              ],
            },
          };
        },
      });
    }
  }, [inView]);

  if ((loading && page === 1) || !showContent) {
    return (
      <div className="load_spinner">
        <div className="spinner" />
      </div>
    );
  }
  if (error) return <p>Error fetching characters 😢</p>;

  // const characters = data?.characters?.results ?? [];

  const filteredCharacters = allCharacters.filter((char) => {
    const statusMatch =
      !statusFilter || char.status.toLowerCase() === statusFilter;
    const speciesMatch =
      !speciesFilter || char.species.toLowerCase() === speciesFilter;
    return statusMatch && speciesMatch;
  });

  const sortedCharacters = filteredCharacters.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "origin") {
      return a.origin.name.localeCompare(b.origin.name);
    }
    return 0;
  });

  return (
    <div className="charList">
      <h2>{t("title")}</h2>

      <div className="margin-bottom">
        <label>
          {t("status")}:
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setFiltersChanged(true);
            }}
          >
            <option value="">{t("all")}</option>
            <option value="alive">{t("alive")}</option>
            <option value="dead">{t("dead")}</option>
            <option value="unknown">{t("unknown")}</option>
          </select>
        </label>

        <label className="margin-left">
          {t("species")}:
          <select
            value={speciesFilter}
            onChange={(e) => {
              setSpeciesFilter(e.target.value);
              setFiltersChanged(true);
            }}
          >
            <option value="">{t("all")}</option>
            <option value="human">Human</option>
            <option value="alien">Alien</option>
          </select>
        </label>

        <label className="margin-left">
          {t("sortBy")}:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">{t("name")}</option>
            <option value="origin">{t("origin")}</option>
          </select>
        </label>
      </div>

      {sortedCharacters.map((char: any) => (
        <div key={char.id} className="character-card">
          <img src={char.image} alt={char.name} width="100" />
          <h3>{char.name}</h3>
          <p>{t('status')}: {readableStatus(char.status)}</p>
          <p>{t('species')}: {char.species}</p>
          <p>{t("gender")}: {char.gender}</p>
          <p>{t('origin')}: {char.origin.name}</p>
        </div>
      ))}

      {fetchingMore && (
        <div style={{ textAlign: "center", padding: "1vh" }}>
          <span>{t('loadingMore')}</span>
          <div className="spinner" />
        </div>
      )}
      <div ref={ref} style={{ height: "145px" }} />
    </div>
  );
};

export default CharacterList;
