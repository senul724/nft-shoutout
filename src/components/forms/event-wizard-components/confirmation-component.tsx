import Link from "next/link";
import SocialIcon from "src/components/icons/social-icons";
import * as chainShorts from "src/data/chaindata-by-shorts.json";
import { AvailableSocialMedia, socialData } from "src/data/social-media-data";
import { FieldValues } from "src/interfaces/event-wizard";

export default function ConfirmationComponent(props: {
  fieldValues: FieldValues;
}) {
  const { fieldValues } = props;
  const fieldTitleStyles = "mt-8";
  const fieldValueStyles = "text-[13px] font-normal text-gray-500 ml-6";

  return (
    <div className="flex flex-col items-start mb-10">
      <p className="mb-5 text-sm font-normal text-gray-500">
        confirm provided information to create your event
      </p>
      <div className="flex flex-col gap-2 w-full">
        <p className={fieldTitleStyles}>Event title</p>
        <p className={fieldValueStyles}>{`${fieldValues.title}`}</p>
        <p className={fieldTitleStyles}>Event display name</p>
        <p className={fieldValueStyles}>{`${fieldValues.displayName}`}</p>
        <p className={fieldTitleStyles}>Event description</p>
        <p className={`${fieldValueStyles} truncate`}>{`${fieldValues.description}`}</p>
        {fieldValues.website !== ""
          ? (
            <>
              <p className={fieldTitleStyles}>Event website</p>
              <a
                className={`${fieldValueStyles} cursor-pointer`}
                target="_blank"
                rel="noreferrer"
              >
                {`${fieldValues.website}`}
              </a>
            </>
          )
          : null}
        <p className={`${fieldTitleStyles} mb-3`}>Social media</p>
        <div className="flex flex-col gap-5 ml-6 w-full">
          {Object.keys(fieldValues.socialMedia).map((socialName, index) => {
            const socialElement = fieldValues.socialMedia[socialName as AvailableSocialMedia];
            return socialElement !== ""
              ? (
                <div className="flex gap-2" key={index}>
                  <Link
                    href={`${socialData[socialName as AvailableSocialMedia].baseUrl}${
                      fieldValues.socialMedia[socialName as AvailableSocialMedia]
                    }`}
                  >
                    <SocialIcon name={socialName as AvailableSocialMedia} size={6} />
                  </Link>
                  <p className={fieldValueStyles}>
                    {`${socialData[socialName as AvailableSocialMedia].baseUrl}${
                      fieldValues.socialMedia[socialName as AvailableSocialMedia]
                    }`}
                  </p>
                </div>
              )
              : null;
          })}
        </div>
        <p className={fieldTitleStyles}>Selected networks</p>
      </div>

      <div className="grid gap-5 mt-4 w-full">
        {fieldValues.networks
          ? Object.keys(fieldValues.networks).map(
            (netKey: string, index: number) => (
              <article key={index} >
                {fieldValues.networks[netKey]?.selected
                  ? (
                    <div
                      key={index}
                      className="flex flex-col p-5 mr-10 w-full bg-white rounded-lg border sm:mr-4"
                    >
                      <p className="mb-2 font-medium capitalize">
                        {chainShorts[netKey as "eth" | "matic" | "bsc"].name}
                      </p>
                      <p className="mt-5 ml-2 text-sm">Receving address</p>
                      <p className={`${fieldValueStyles} truncate`}>
                        {fieldValues.networks[netKey]?.receiver}
                      </p>
                      <p className="mt-3 ml-2 text-sm">Token contributions allowed</p>
                      {fieldValues.networks[netKey]?.tokens
                        ? (
                          <p className={fieldValueStyles}>
                            yes
                          </p>
                        )
                        : (
                          <p className={fieldValueStyles}>
                            no
                          </p>
                        )}
                    </div>
                  )
                  : null}
              </article>
            ),
          )
          : null}
      </div>
    </div>
  );
}
