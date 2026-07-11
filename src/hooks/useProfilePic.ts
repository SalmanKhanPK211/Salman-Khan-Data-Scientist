import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImageUrl } from "@/lib/portfolioAssets";
import profileImg from "@/assets/profile.jpg";

export const useProfilePic = () => {
  const [url, setUrl] = useState<string>(profileImg);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "profile_pic_url")
      .maybeSingle()
      .then(({ data }) => {
        if (active && data?.value) setUrl(resolveImageUrl(data.value, profileImg));
      });
    return () => {
      active = false;
    };
  }, []);

  return url;
};
